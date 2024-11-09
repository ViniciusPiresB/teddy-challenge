import { Injectable } from '@nestjs/common';
import { nanoid } from 'nanoid';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class ShortenerService {
  constructor(private readonly prismaService: PrismaService) {}

  async createShortUrl(longUrl: string) {
    const shortUrl = nanoid(6);

    const createdShortUrl = await this.prismaService.shortUrls.create({
      data: {
        longUrl,
        shortUrl,
      },
    });

    const shortenedUrl = `${process.env.BASE_URL}/${createdShortUrl.shortUrl}`;

    return { shortenedUrl };
  }
}
