import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ShortenerModule } from './shortener/shortener.module';

@Module({
  imports: [UserModule, ShortenerModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
