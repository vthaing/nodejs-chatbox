import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateRestrictedIpDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  ip: string;
  @ApiProperty({ required: true })
  enabled: boolean;
  @ApiProperty({ required: false })
  notes?: string;
}
