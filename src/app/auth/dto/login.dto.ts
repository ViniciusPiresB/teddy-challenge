import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    title: 'Email of user to login',
    type: String,
    description: 'This is a required property',
    example: 'email@email.com',
    required: true,
  })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    title: 'Password of user to login',
    type: String,
    description: 'This is a required property',
    example: 'pass123',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
