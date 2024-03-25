import { Injectable } from '@nestjs/common';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import {
  Conversation,
  ConversationDocument,
} from './entities/conversation.entity';
import { BrandDocument } from '../brand/entities/brand.entity';
import {
  BrandChannel,
  BrandChannelDocument,
} from '../brand-channel/entities/brand-channel.entity';
import { BrandRoomDocument } from '../brand-room/entities/brand-room.entity';
import {InitChatDto} from "../brand-chat/dto/init-chat.dto";

@Injectable()
export class ConversationService {
  constructor(
    @InjectModel(Conversation.name)
    private readonly conversationModel: Model<ConversationDocument>,
  ) {}

  create(createConversationDto: CreateConversationDto) {
    const createdConversation = new this.conversationModel(
      createConversationDto,
    );
    return createdConversation.save();
  }

  findAll(
    params: FilterQuery<ConversationDocument> = {},
  ): Promise<ConversationDocument[]> {
    return this.conversationModel
      .find({
        ...params,
      })
      .populate('memberObjects')
      .exec();
  }

  findUserConversations(userId: string): Promise<ConversationDocument[]> {
    return this.conversationModel.find({ members: { $all: [userId] } }).exec();
  }

  findOne(id: string): Promise<ConversationDocument> {
    return this.conversationModel.findById(id).populate('memberObjects').exec();
  }

  update(
    id: string,
    updateConversationDto: UpdateConversationDto,
  ): Promise<ConversationDocument> {
    return this.conversationModel
      .findByIdAndUpdate(id, updateConversationDto, {
        upsert: false,
        new: true,
      })
      .exec();
  }

  remove(id: string): Promise<ConversationDocument> {
    return this.conversationModel.findByIdAndDelete(id).exec();
  }

  async getOrCreateConversation(
    initChatDto: InitChatDto,
    brand: BrandDocument,
    brandChannel?: BrandChannelDocument,
    brandRoom?: BrandRoomDocument,
  ): Promise<ConversationDocument> {
    let conversation = await this.conversationModel.findOne({
      brandId: brand.id,
      brandChannelId: brandChannel?.id,
      brandRoomId: brandRoom?.id,
    });

    if (!conversation) {
      const conversationDto = new CreateConversationDto();

      conversationDto.brandId = brand.id;
      conversationDto.brandChannelId = brandChannel?.id;
      conversationDto.brandRoomId = brandRoom?.id;
      conversationDto.name = initChatDto.chatName;

      conversation = await this.create(conversationDto);
    }

    return conversation;
  }
}
