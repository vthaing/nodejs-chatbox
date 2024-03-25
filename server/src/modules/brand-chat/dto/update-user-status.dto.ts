import { ApiProperty } from '@nestjs/swagger';
export class UpdateUserStatusDto {
  @ApiProperty({ required: true })
  userId: string;
  @ApiProperty({ required: true })
  status: boolean;
}
