import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateShortDto {
  @ApiProperty({
    title: 'Destination URL to change in a shortened URL',
    type: String,
    example: 'https://new-website.com.br/new-function',
    description: 'This is a required property',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  longUrl: string;
}
