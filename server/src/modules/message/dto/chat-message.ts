import { ApiProperty } from '@nestjs/swagger';
import { MessageSenderInfo } from './message-sender-info';
import { MediaItem } from '../../media-item/entities/media-item.entity';
export class ChatMessage {
  @ApiProperty()
  id: string;
  @ApiProperty()
  to?: string;
  @ApiProperty()
  conversation?: string;
  @ApiProperty()
  senderInfo: MessageSenderInfo;
  @ApiProperty()
  messageContent: string;
  @ApiProperty()
  from: string;
  @ApiProperty()
  isPinnedMessage: boolean;
  @ApiProperty()
  attachments?: [];
  @ApiProperty()
  mediaItems?: [MediaItem];
  @ApiProperty()
  createdAt?: string;
}
