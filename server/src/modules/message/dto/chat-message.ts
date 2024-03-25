import { ApiProperty } from '@nestjs/swagger';
export class ChatMessage {
  @ApiProperty()
  id: string;
  @ApiProperty()
  to?: string;
  @ApiProperty()
  conversation?: string;
  @ApiProperty()
  senderInfo: any;
  @ApiProperty()
  messageContent: string;
  @ApiProperty()
  from: string;
  @ApiProperty()
  isPinnedMessage: boolean;
  @ApiProperty()
  @ApiProperty()
  attachments?: [];
  @ApiProperty()
  mediaItems?: [];
  @ApiProperty()
  createdAt?: string;
}
