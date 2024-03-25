import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateBrandDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  name: string;
  @ApiProperty({ required: true })
  @IsNotEmpty()
  enabled: boolean;

  @ApiProperty()
  @IsNotEmpty()
  canUploadAttachment: boolean;
}
