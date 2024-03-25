import {IsArray, IsNotEmpty, IsOptional} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateConversationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  name?: string;
  @ApiProperty({ required: false })
  @IsOptional()
  owner?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  members: Array<string>;

  @ApiProperty()
  @IsNotEmpty()
  brandId: string;
  @ApiProperty()
  @IsOptional()
  brandChannelId?: string;
  @ApiProperty()
  @IsOptional()
  brandRoomId?: string;

  @ApiProperty()
  @IsNotEmpty()
  canUploadAttachment: boolean;
}
