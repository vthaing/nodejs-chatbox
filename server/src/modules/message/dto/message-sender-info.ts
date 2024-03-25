import { ApiProperty } from '@nestjs/swagger';

export class MessageSenderInfo {
  @ApiProperty()
  id: string;
  @ApiProperty()
  online: boolean;
  @ApiProperty()
  displayName: string;
  @ApiProperty()
  roles: string[];
}
