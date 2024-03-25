import { Injectable } from '@nestjs/common';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import {
  Conversation,
  ConversationDocument,
} from './entities/conversation.entity';

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
}
