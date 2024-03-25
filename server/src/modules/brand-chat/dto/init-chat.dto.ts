import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
export class InitChatDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  brandId: string;
  @ApiProperty({ required: true })
  @IsNotEmpty()
  userId: string;
  @ApiProperty({ required: true })
  @IsNotEmpty()
  chatName: string;
  @ApiProperty({ required: true })
  @IsNotEmpty()
  userDisplayName: string;
  @ApiProperty({ required: false })
  @IsNotEmpty()
  channelId: string;
  @ApiProperty({ required: false })
  @IsNotEmpty()
  roomId: string;
  @ApiProperty({ required: false })
  @IsNotEmpty()
  channelName: string;
  @ApiProperty({ required: false })
  @IsNotEmpty()
  roomName: string;
}
