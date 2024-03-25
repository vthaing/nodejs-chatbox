import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class BrandChatUserDto {
  @ApiProperty()
  @IsNotEmpty()
  displayName: string;

  @ApiProperty()
  @IsNotEmpty()
  brandId: string;

  @ApiProperty()
  @IsNotEmpty()
  externalId: string;
}
