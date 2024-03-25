import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateMediaItemDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;
  @ApiProperty()
  @IsNotEmpty()
  size: number;
  @ApiProperty()
  @IsNotEmpty()
  mimeType: string;
  @ApiProperty()
  @IsNotEmpty()
  disk: string;
  @ApiProperty()
  @IsNotEmpty()
  userId;
  @ApiProperty()
  @IsOptional()
  messageId;
  @ApiProperty()
  @IsNotEmpty()
  path;

  @ApiProperty()
  @IsOptional()
  params?: any;
}
