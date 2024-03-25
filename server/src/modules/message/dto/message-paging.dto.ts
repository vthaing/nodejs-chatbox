import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { DEFAULT_CHAT_BOX_MESSAGE_LIMIT } from '../entities/message.entity';

export class MessagePagingDto {
  @ApiProperty({ required: false })
  @IsOptional()
  beforeMessageId: string | null;

  @ApiProperty({ required: false })
  @IsOptional()
  fromMessageId: string | null;
  @ApiProperty({ required: false, default: DEFAULT_CHAT_BOX_MESSAGE_LIMIT })
  @IsOptional()
  limit: number = DEFAULT_CHAT_BOX_MESSAGE_LIMIT;
  @ApiProperty({ required: false })
  @IsOptional()
  brandId: string | null;
  @ApiProperty({ required: false })
  @IsOptional()
  isPinnedMessage: boolean | null;

}
