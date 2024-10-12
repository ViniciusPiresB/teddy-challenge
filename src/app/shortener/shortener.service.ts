import { Injectable, NotFoundException } from '@nestjs/common';
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

    return createdShortUrl;
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
