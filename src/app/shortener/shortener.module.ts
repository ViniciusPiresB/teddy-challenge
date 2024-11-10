import { Module } from '@nestjs/common';
import { ShortenerService } from './shortener.service';
import { ShortenerController } from './shortener.controller';
import { PrismaService } from '../../database/prisma.service';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [CacheModule.register({ ttl: 300000, max: 100 })],
  controllers: [ShortenerController],
  providers: [ShortenerService, PrismaService],
})
export class ShortenerModule {}
