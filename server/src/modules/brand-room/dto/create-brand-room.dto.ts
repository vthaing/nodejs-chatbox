import { ApiProperty } from '@nestjs/swagger';
export class CreateBrandRoomDto {
  @ApiProperty({ required: false })
  name?: string;
  @ApiProperty({ required: true })
  brandId: string;
  @ApiProperty({ required: true })
  brandChannelId: string;
  @ApiProperty({ required: true })
  externalId: string;
  @ApiProperty({ required: true })
  externalBrandChannelId: string;
}
