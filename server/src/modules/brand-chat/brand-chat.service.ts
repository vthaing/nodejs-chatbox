import { Injectable, NotFoundException } from '@nestjs/common';
import { InitChatDto } from './dto/init-chat.dto';
import { BrandChannelService } from '../brand-channel/brand-channel.service';
import { BrandRoomService } from '../brand-room/brand-room.service';
import { UserService } from '../user/user.service';
import { ConversationService } from '../conversation/conversation.service';
import { BrandService } from '../brand/brand.service';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class BrandChatService {
  constructor(
    private brandService: BrandService,
    private brandChannelService: BrandChannelService,
    private brandRoomService: BrandRoomService,
    private userService: UserService,
    private conversationService: ConversationService,
    private authService: AuthService,
  ) {}
  async initChat(initChatDto: InitChatDto) {
    const { conversation, user } = await this.getOrCreateBrandChatDependencies(
      initChatDto,
    );

    return {
      ...(await this.authService.login(user)),
      conversation_id: conversation.id,
    };
  }

  async getOrCreateBrandChatDependencies(initChatDto: InitChatDto) {
    const brand = await this.brandService.findOne(initChatDto.brandId);
    if (!brand) {
      throw new NotFoundException('Invalid brand id ' + initChatDto.brandId);
    }

    const brandChannel = await this.brandChannelService.getOrCreateBrandChannel(
      brand,
      initChatDto,
    );

    const brandRoom = await this.brandRoomService.getOrCreateBrandRoom(
      initChatDto,
      brandChannel,
    );

    const conversation = await this.conversationService.getOrCreateConversation(
      initChatDto,
      brand,
      brandChannel,
      brandRoom,
    );

    const user = await this.userService.getOrCreateUser(brand, initChatDto);

    if (!conversation.members.includes(user.id)) {
      conversation.members.push(user.id);
      await conversation.save();
    }

    return {
      brand: brand,
      brandChannel: brandChannel,
      brandRoom: brandRoom,
      conversation: conversation,
      user: user,
    };
  }
}
