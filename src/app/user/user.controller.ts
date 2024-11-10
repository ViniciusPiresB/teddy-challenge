import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiOperation, ApiOkResponse, ApiNotFoundResponse, ApiBearerAuth, ApiCreatedResponse, ApiConflictResponse, ApiForbiddenResponse } from '@nestjs/swagger';
import { Roles } from '../auth/decorator/roles.decorator';
import { AdminRole, UserRole } from '../auth/roles/roles';
import { GetUser } from '../decorator/get-user.decorator';
import { JwtPayload } from '../auth/dto/jwt-payload.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Creates a user.' })
  @ApiCreatedResponse({ description: 'Created Successfully.' })
  @ApiConflictResponse({ description: 'User already exist.' })
  @ApiForbiddenResponse({
    description: 'Missing token or not enough permission.',
  })
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @ApiOperation({ summary: 'Find one user by email.' })
  @ApiOkResponse({ description: 'User Found.' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiForbiddenResponse({
    description: 'Missing token or not enough permission.',
  })
  @ApiBearerAuth()
  @Roles(...AdminRole)
  @Get(':email')
  findByEmail(@Param('email') email: string) {
    return this.userService.findByEmail(email);
  }

  @ApiOperation({ summary: 'Delete your user.' })
  @ApiOkResponse({ description: 'User deleted.' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiForbiddenResponse({
    description: 'Missing token or not enough permission.',
  })
  @ApiBearerAuth()
  @Roles(...UserRole)
  @Delete()
  deleteAccount(@GetUser() activeUser: JwtPayload) {
    return this.userService.delete(activeUser.email);
  }
}
