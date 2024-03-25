import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateBrandChannelDto {
  @ApiProperty({ required: false })
  @IsOptional()
  name?: string;

  @ApiProperty({ required: true })
  @IsUUID()
  brandId: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  externalId: string;
}
