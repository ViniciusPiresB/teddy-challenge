import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateShortDto {
  @ApiProperty({
    title: 'URL to be shortened',
    type: String,
    example: 'https://website.com.br/function',
    description: 'This is a required property',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  url: string;
}
