import { ApiProperty } from '@nestjs/swagger';

export class CreateBrandDto {
  @ApiProperty({ required: true })
  name: string;
  @ApiProperty({ required: true })
  externalId: string;
  @ApiProperty({ required: true })
  secretKey: string;
  @ApiProperty({ required: true })
  enabled: boolean;
}
