import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { ShortenerService } from './shortener.service';
import { CreateShortDto } from './dto/create-short.dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiNotFoundResponse, ApiOperation } from '@nestjs/swagger';
import { GetUser } from '../decorator/get-user.decorator';
import { JwtPayload } from '../auth/dto/jwt-payload.dto';

@Controller('shortener')
export class ShortenerController {
  constructor(private readonly shortenerService: ShortenerService) {}

  @ApiOperation({ summary: 'Creates an url shortened.' })
  @ApiCreatedResponse({ description: 'URL created successfully.' })
  @ApiBadRequestResponse({ description: 'Url Empty.' })
  @ApiBadRequestResponse({ description: 'Url must be a string.' })
  @ApiBearerAuth()
  @Post()
  create(@Body() createShortDto: CreateShortDto, @GetUser() user: JwtPayload) {
    return this.shortenerService.createShortUrl(createShortDto.url, user);
  }

  @ApiOperation({ summary: 'Redirect the short url to url registered.' })
  @ApiNotFoundResponse({ description: 'Short URL not found.' })
  @Get(':shortUrl')
  async redirect(@Param('shortUrl') shortUrl: string, @Res() res) {
    const record = await this.shortenerService.findLongUrl(shortUrl);

    return res.status(200).redirect(record.longUrl);
  }
}
