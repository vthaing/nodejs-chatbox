import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateRestrictedIpDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  ip: string;
  @ApiProperty({ required: true })
  @IsNotEmpty()
  enabled: boolean;
  @ApiProperty({ required: false })
  @IsOptional()
  notes?: string;
}
