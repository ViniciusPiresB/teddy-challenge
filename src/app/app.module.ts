import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ShortenerModule } from './shortener/shortener.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UserModule, ShortenerModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
