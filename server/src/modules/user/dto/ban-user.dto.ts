import { ApiProperty } from '@nestjs/swagger';
export class BanUserDto {
  @ApiProperty()
  reason?: string | null;
  @ApiProperty()
  duration?: number | null;
}
