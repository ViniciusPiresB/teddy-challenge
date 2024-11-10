import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [ConfigModule.forRoot(), UserModule, PassportModule, JwtModule.register({ privateKey: process.env.JWT_SECRET })],
  controllers: [],
  providers: [],
})
export class AuthModule {}
