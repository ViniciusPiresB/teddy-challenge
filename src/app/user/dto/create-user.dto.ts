import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    title: 'Email of user',
    type: String,
    example: 'john_doe@email.com',
    description: 'This is a required property',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    title: 'Username of user',
    type: String,
    example: 'john_doe',
    description: 'This is a required property',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    title: 'Password of user',
    type: String,
    example: 'pass123',
    description: 'This is a required property',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    title: 'Name of user',
    type: String,
    example: 'John Doe',
    description: 'This is a required property',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
