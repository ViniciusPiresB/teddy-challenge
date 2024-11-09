import { Module } from '@nestjs/common';
import { ShortenerService } from './shortener.service';
import { ShortenerController } from './shortener.controller';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  controllers: [ShortenerController],
  providers: [ShortenerService, PrismaService],
})
export class ShortenerModule {}
