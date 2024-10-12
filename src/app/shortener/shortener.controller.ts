import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { ShortenerService } from './shortener.service';
import { CreateShortDto } from './dto/create-short.dto';

@Controller()
export class ShortenerController {
  constructor(private readonly shortenerService: ShortenerService) {}

  @Post()
  create(@Body() createShortDto: CreateShortDto) {
    return this.shortenerService.createShortUrl(createShortDto.url);
  }

  @Get(':shortUrl')
  async redirect(@Param('shortUrl') shortUrl: string, @Res() res) {
    const record = await this.shortenerService.findLongUrl(shortUrl);

    return res.status(200).redirect(record.longUrl);
  }
}
