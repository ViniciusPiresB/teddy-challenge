import { Body, Controller, Post } from '@nestjs/common';
import { ShortenerService } from './shortener.service';
import { CreateShortDto } from './dto/create-short.dto';

@Controller('shortener')
export class ShortenerController {
  constructor(private readonly shortenerService: ShortenerService) {}

  @Post()
  create(@Body() createShortDto: CreateShortDto) {
    return this.shortenerService.createShortUrl(createShortDto.url);
  }
}
