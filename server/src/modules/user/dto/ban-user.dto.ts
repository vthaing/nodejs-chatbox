import { ApiProperty } from '@nestjs/swagger';
import {IsOptional} from "class-validator";
export class BanUserDto {
  @ApiProperty()
  @IsOptional()
  reason?: string | null;
  @ApiProperty()
  @IsOptional()
  duration?: number | null;
}
