import { Body, Controller, Get, Param, Patch, Post, Res } from '@nestjs/common';
import { ShortenerService } from './shortener.service';
import { CreateShortDto } from './dto/create-short.dto';
import { GetUser } from '../decorator/get-user.decorator';
import { JwtPayload } from '../auth/dto/jwt-payload.dto';
import { Roles } from '../auth/decorator/roles.decorator';
import { UserRole } from '../auth/roles/roles';
import { UpdateShortDto } from './dto/update-short.dto';

@Controller()
export class ShortenerController {
  constructor(private readonly shortenerService: ShortenerService) {}

  @Post()
  create(@Body() createShortDto: CreateShortDto, @GetUser() user: JwtPayload) {
    return this.shortenerService.createShortUrl(createShortDto.url, user);
  }

  @Get('/url')
  @Roles(...UserRole)
  async listUrlsOfUser(@GetUser() user: JwtPayload) {
    return this.shortenerService.listUrlsOfUser(user);
  }

  @Roles(...UserRole)
  @Patch('/url/:shortUrl')
  async updateLongUrl(@Param('shortUrl') shortUrl: string, @GetUser() user: JwtPayload, @Body() updateShort: UpdateShortDto) {
    return this.shortenerService.updateLongUrl(user, shortUrl, updateShort.longUrl);
  }

  @Get(':shortUrl')
  async redirect(@Param('shortUrl') shortUrl: string, @Res() res) {
    const record = await this.shortenerService.findLongUrl(shortUrl);

    return res.status(200).redirect(record.longUrl);
  }
}
