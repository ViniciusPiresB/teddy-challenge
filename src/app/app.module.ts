import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ShortenerModule } from './shortener/shortener.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/roles/roles.guard';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [UserModule, ShortenerModule, AuthModule, JwtModule],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
