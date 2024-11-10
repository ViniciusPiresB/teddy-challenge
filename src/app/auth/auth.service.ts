import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { validatePassword } from '../utils/validate-password';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validate(user: LoginDto) {
    const userOfDb = await this.userService.findByEmail(user.email);

    if (!userOfDb) throw new UnauthorizedException('Email or password invalid.');

    if (!user.password || !user.email) throw new BadRequestException('Missing password or email in request.');

    const isValid = await validatePassword(user.password, userOfDb.password);

    if (!isValid) throw new UnauthorizedException('Email or password invalid.');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = userOfDb;

    const accessToken = this.jwtService.sign(rest, {
      privateKey: process.env.JWT_SECRET,
    });

    return { accessToken };
  }
}
