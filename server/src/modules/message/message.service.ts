import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import {
  DEFAULT_CHAT_BOX_MESSAGE_LIMIT,
  Message,
  MessageDocument,
} from './entities/message.entity';
import { MediaItemService } from '../media-item/media-item.service';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name)
    private readonly messageModel: Model<MessageDocument>,
    private readonly mediaItemService: MediaItemService,
  ) {}

  create(createMessageDto: CreateMessageDto): Promise<MessageDocument> {
    const createdMessage = new this.messageModel(createMessageDto);
    return createdMessage.save();
  }

  findAll(
    params: FilterQuery<MessageDocument> = {},
  ): Promise<MessageDocument[]> {
    return this.messageModel
      .find({
        ...params,
      })
      .populate(this.getRequiredRelationProperties())
      .exec();
  }

  getMessagesForChatBoxClient(
    params: FilterQuery<MessageDocument> = {},
    limit = DEFAULT_CHAT_BOX_MESSAGE_LIMIT,
  ) {
    return this.messageModel
      .find(params)
      .limit(limit)
      .populate(this.getRequiredRelationProperties())
      .then((messages) => {
        return messages.map((message) => message.transformToChatBoxData());
      });
  }

  getRequiredRelationProperties() {
    return ['senderInfo', 'mediaItems'];
  }

  findOne(id: string): Promise<MessageDocument> {
    return this.messageModel.findById(id).populate('senderInfo').exec();
  }

  update(
    id: string,
    updateMessageDto: UpdateMessageDto,
  ): Promise<MessageDocument> {
    return this.messageModel
      .findByIdAndUpdate(id, updateMessageDto, { upsert: false, new: true })
      .exec();
  }

  remove(id: string): Promise<MessageDocument> {
    return this.messageModel.findByIdAndDelete(id).exec();
  }

  findOneBy(
    params: FilterQuery<MessageDocument> = {},
  ): Promise<MessageDocument> | null {
    return this.messageModel.findOne(params).exec();
  }

  async attachMediaItem(
    messageId: string,
    userId: string,
    uploadedFile: Express.Multer.File,
    uid?: string | null,
  ) {
    const message = await this.messageModel.findById(messageId).exec();
    if (!message) {
      throw new NotFoundException('Message not found');
    }

    if (message.from.toString() !== userId) {
      throw new NotFoundException('Invalid message owner');
    }

    return await this.mediaItemService.createMessageAttachment(
      message,
      uploadedFile,
      uid,
    );
  }
}
