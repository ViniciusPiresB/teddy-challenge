import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { nanoid } from 'nanoid';
import { PrismaService } from 'src/database/prisma.service';
import { JwtPayload } from '../auth/dto/jwt-payload.dto';
import { Status } from '@prisma/client';

@Injectable()
export class ShortenerService {
  constructor(private readonly prismaService: PrismaService) {}

  async createShortUrl(longUrl: string, user: JwtPayload) {
    const shortUrl = nanoid(6);

    const createdShortUrl = await this.prismaService.shortUrls.create({
      data: {
        longUrl,
        shortUrl,
        userId: user ? user.id : undefined,
      },
    });

    return createdShortUrl;
  }

  async listUrlsOfUser(user: JwtPayload) {
    if (!user) throw new BadRequestException('User not provided.');

    const urls = await this.prismaService.shortUrls.findMany({
      where: {
        userId: user.id,
        status: Status.ACTIVE,
      },
    });

    return urls;
  }

  async updateLongUrl(user: JwtPayload, shortUrl: string, longUrl: string) {
    if (!user) throw new BadRequestException('User not provided.');

    const url = await this.prismaService.shortUrls.findUnique({
      where: { shortUrl },
    });

    if (!url) throw new NotFoundException('ShortUrl Not Found.');

    const urlUserId = url.userId;

    if (!urlUserId || urlUserId != user.id) throw new UnauthorizedException("This URL isn't from this user!");

    const updatedUrl = await this.prismaService.shortUrls.update({
      where: { shortUrl },
      data: { longUrl },
    });

    return updatedUrl;
  }

  async findLongUrl(shortUrl: string) {
    const record = await this.prismaService.shortUrls.findUnique({
      where: { shortUrl },
    });

    if (!record) throw new NotFoundException('Url not found');

    await this.prismaService.shortUrls.update({
      where: record,
      data: {
        click: {
          increment: 1,
        },
      },
    });

    return record;
  }
}
