import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, SchemaTypes } from 'mongoose';
import * as mongoose from 'mongoose';
import { User, UserDocument } from '../../user/entities/user.entity';
import { Conversation } from '../../conversation/entities/conversation.entity';
import { UserBanRequest } from '../../user-ban-request/entities/user-ban-request.entity';
import { MediaItem } from '../../media-item/entities/media-item.entity';
import { ChatMessage } from '../dto/chat-message';
import { MessageSenderInfo } from '../dto/message-sender-info';
export const DEFAULT_CHAT_BOX_MESSAGE_LIMIT = 30;

export type MessageDocument = Message & Document;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
    transform: (doc: MessageDocument, ret) => {
      delete ret.__v;
      ret.id = ret._id;
      delete ret._id;
    },
  },
  toObject: { virtuals: true, getters: true },
})
export class Message {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  from: User | string | ObjectId;

  @Prop({
    required: false,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  to: UserDocument | string | ObjectId;

  @Prop({
    required: false,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
  })
  conversation: Conversation | string;

  @Prop({ required: true, type: mongoose.Schema.Types.String })
  text: string;

  @Prop({ required: false, type: mongoose.Schema.Types.String })
  maskedText?: string;
  @Prop({ required: false, type: mongoose.Schema.Types.Boolean })
  isPinnedMessage: boolean;

  @Prop({ required: false, type: mongoose.Schema.Types.Array })
  attachments?: [];
  @Prop({ ref: 'MediaItem', type: [SchemaTypes.ObjectId] })
  mediaItemIds: [ObjectId];
  @Prop({ ref: 'UserBanRequest', type: [SchemaTypes.ObjectId] })
  userBanRequests?: [ObjectId | UserBanRequest];
  userBanRequestDocuments?: [UserBanRequest];
  isViolatedMessage: boolean;
  mediaItems?: [MediaItem];

  bannedReasons?: [string | ObjectId];
  transformToChatBoxData: () => ChatMessage;
  createdAt?: Date | null;
}
const MessageSchema = SchemaFactory.createForClass(Message);
MessageSchema.virtual('senderInfo', {
  ref: 'User',
  localField: 'from',
  foreignField: '_id',
  justOne: true,
});

MessageSchema.virtual('userBanRequestDocuments', {
  ref: 'UserBanRequest',
  localField: 'userBanRequests',
  foreignField: '_id',
});

MessageSchema.virtual('mediaItems', {
  ref: 'MediaItem',
  localField: 'mediaItemIds',
  foreignField: '_id',
});

MessageSchema.virtual('messageContent').get(function () {
  return this.maskedText ?? this.text;
});

MessageSchema.virtual('isViolatedMessage').get(function () {
  return this.userBanRequests.length > 0;
});

MessageSchema.virtual('bannedReasons').get(function () {
  if (!this.userBanRequestDocuments) {
    return [];
  }
  return this.userBanRequestDocuments.map((userBanRequest) => {
    return userBanRequest.reason;
  });
});

MessageSchema.methods.transformToChatBoxData = function (): ChatMessage {
  return {
    id: this.id,
    to: this.to,
    conversation: this.conversation,
    senderInfo: {
      id: this.senderInfo.id,
      online: this.senderInfo.online,
      displayName: this.senderInfo.displayName,
      roles: this.senderInfo.roles,
    } as MessageSenderInfo,
    messageContent: this.messageContent,
    from: this.from,
    isPinnedMessage: this.isPinnedMessage,
    attachments: this.attachments,
    mediaItems: this.mediaItems,
    createdAt: this.createdAt,
  };
};

export { MessageSchema };
