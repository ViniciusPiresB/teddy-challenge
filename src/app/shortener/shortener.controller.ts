import { Controller, Get } from '@nestjs/common';
import { ShortenerService } from './shortener.service';

@Controller('shortener')
export class ShortenerController {
  constructor(private readonly shortenerService: ShortenerService) {}

  @Get()
  create() {
    return this.shortenerService.createShortUrl('sampleurl');
  }
}
