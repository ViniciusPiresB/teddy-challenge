import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { ShortenerService } from './shortener.service';
import { CreateShortDto } from './dto/create-short.dto';
import { ApiBadRequestResponse, ApiOkResponse, ApiForbiddenResponse, ApiBearerAuth, ApiCreatedResponse, ApiNotFoundResponse, ApiOperation } from '@nestjs/swagger';
import { GetUser } from '../decorator/get-user.decorator';
import { JwtPayload } from '../auth/dto/jwt-payload.dto';
import { Roles } from '../auth/decorator/roles.decorator';
import { UserRole } from '../auth/roles/roles';

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

  @ApiOperation({ summary: 'List all urls created by your user.' })
  @ApiOkResponse({ description: 'List of all urls.' })
  @ApiForbiddenResponse({
    description: 'Missing token or not enough permission.',
  })
  @ApiBearerAuth()
  @Get('/url')
  @Roles(...UserRole)
  async listUrlsOfUser(@GetUser() user: JwtPayload) {
    return this.shortenerService.listUrlsOfUser(user);
  }

  @ApiOperation({ summary: 'Redirect the short url to url registered.' })
  @ApiNotFoundResponse({ description: 'Short URL not found.' })
  @Get(':shortUrl')
  async redirect(@Param('shortUrl') shortUrl: string, @Res() res) {
    const record = await this.shortenerService.findLongUrl(shortUrl);

    return res.status(200).redirect(record.longUrl);
  }
}
