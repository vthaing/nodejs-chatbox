import { ApiProperty } from '@nestjs/swagger';

export class CreateRestrictedIpDto {
  @ApiProperty({ required: true })
  ip: string;
  @ApiProperty({ required: true })
  enabled: boolean;
  @ApiProperty({ required: false })
  notes?: string;
}
