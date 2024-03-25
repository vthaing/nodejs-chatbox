import { IsArray, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateBrandChannelDto {
  @ApiProperty({ required: false })
  name?: string;

  @ApiProperty({ required: true })
  brandId: string;

  @ApiProperty({ required: false })
  externalId: string;

  @ApiProperty({ required: false })
  externalBrandId: string;
}
