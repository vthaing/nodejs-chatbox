import { Injectable } from '@nestjs/common';
import { InitChatDto } from './dto/init-chat.dto';
import { BrandChannelService } from '../brand-channel/brand-channel.service';
import { BrandRoomService } from '../brand-room/brand-room.service';
import { UserService } from '../user/user.service';
import { ConversationService } from '../conversation/conversation.service';
import { BrandService } from '../brand/brand.service';

@Injectable()
export class BrandChatService {
  constructor(
    private brandService: BrandService,
    private brandChannelService: BrandChannelService,
    private brandRoomService: BrandRoomService,
    private userService: UserService,
    private conversationService: ConversationService,
  ) {}
  initChat(initChatDto: InitChatDto) {
    return 'Hello';
  }
}
