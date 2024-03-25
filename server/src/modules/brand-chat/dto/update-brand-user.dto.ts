import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
export class UpdateBrandUserDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  displayName: string;
  @ApiProperty({ required: true })
  @IsNotEmpty()
  enabled: boolean;
}
