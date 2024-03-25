import { IsArray, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateBrandChannelDto {
  @ApiProperty({ required: false })
  name?: string;

  @ApiProperty({ required: true })
  brandId: string;

  @ApiProperty({ required: true })
  externalId: string;

  @ApiProperty({ required: true })
  externalBrandId: string;
}