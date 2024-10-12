import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Roles } from '../auth/decorator/roles.decorator';
import { AdminRole, UserRole } from '../auth/roles/roles';
import { GetUser } from '../decorator/get-user.decorator';
import { JwtPayload } from '../auth/dto/jwt-payload.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Roles(...AdminRole)
  @Get(':email')
  findByEmail(@Param('email') email: string) {
    return this.userService.findByEmail(email);
  }

  @Roles(...UserRole)
  @Delete()
  deleteAccount(@GetUser() activeUser: JwtPayload) {
    return this.userService.delete(activeUser.email);
  }
}
