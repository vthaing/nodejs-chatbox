import { ApiProperty } from '@nestjs/swagger';

export class UserIpEntity {
  @ApiProperty({ required: false })
  ip: string;
  time: Date;
}
