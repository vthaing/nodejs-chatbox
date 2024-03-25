import { ApiProperty } from '@nestjs/swagger';
export class InitChatDto {
  @ApiProperty({ required: true })
  brandId: string;
  @ApiProperty({ required: true })
  userId: string;
  @ApiProperty({ required: true })
  chatName: string;
  @ApiProperty({ required: true })
  userDisplayName: string;
  @ApiProperty({ required: false })
  channelId: string;
  @ApiProperty({ required: false })
  roomId: string;
  @ApiProperty({ required: false })
  channelName: string;
  @ApiProperty({ required: false })
  roomName: string;
}
