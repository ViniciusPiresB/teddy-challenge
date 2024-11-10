import { Injectable, NotFoundException } from '@nestjs/common';
import { nanoid } from 'nanoid';
import { PrismaService } from 'src/database/prisma.service';
import { JwtPayload } from '../auth/dto/jwt-payload.dto';

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

    const shortenedUrl = `${process.env.BASE_URL}/${createdShortUrl.shortUrl}`;

    return { shortenedUrl };
  }

  async findLongUrl(shortUrl: string) {
    const url = await this.getUrl(shortUrl);

    const urlFound = await this.prismaService.shortUrls.update({
      where: url,
      data: {
        click: {
          increment: 1,
        },
      },
    });

    return urlFound;
  }

  private async getUrl(shortUrl: string) {
    const url = await this.prismaService.shortUrls.findUnique({
      where: { shortUrl },
    });

    if (!url) throw new NotFoundException('ShortUrl Not Found.');

    return url;
  }
}
