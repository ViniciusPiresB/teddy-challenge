import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LocalGuard } from './guard/local.guard';
import { ApiCreatedResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Login.' })
  @ApiCreatedResponse({ description: 'Login.' })
  @ApiUnauthorizedResponse({ description: 'Email or password invalid.' })
  @Post('login')
  @UseGuards(LocalGuard)
  login(@Body() loginDto: LoginDto) {
    return this.authService.validate(loginDto);
  }
}
