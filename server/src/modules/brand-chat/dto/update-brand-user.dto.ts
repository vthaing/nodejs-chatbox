import { ApiProperty } from '@nestjs/swagger';
export class UpdateBrandUserDto {
  @ApiProperty({ required: true })
  displayName: string;
  @ApiProperty({ required: true })
  enabled: boolean;
}
