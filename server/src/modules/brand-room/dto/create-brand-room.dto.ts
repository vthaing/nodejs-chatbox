import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
export class CreateBrandRoomDto {
  @ApiProperty({ required: false })
  @IsOptional()
  name?: string;
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsUUID()
  brandId: string;
  @ApiProperty({ required: true })
  @IsNotEmpty()
  brandChannelId: string;
  @ApiProperty({ required: true })
  @IsNotEmpty()
  externalId: string;
  @ApiProperty({ required: true })
  @IsNotEmpty()
  externalBrandChannelId: string;
}
