import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, SchemaTypes } from 'mongoose';
import * as mongoose from 'mongoose';
import { User, UserDocument } from '../../user/entities/user.entity';
import { Channel } from '../../channels/entities/channel.entity';
import {
  UserBanRequest,
  UserBanRequestDocument,
} from '../../user-ban-request/entities/user-ban-request.entity';

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
    ref: 'Channel',
  })
  channel: Channel | string;

  @Prop({ required: true, type: mongoose.Schema.Types.String })
  text: string;

  @Prop({ required: false, type: mongoose.Schema.Types.String })
  maskedText?: string;

  @Prop({ ref: 'UserBanRequest', type: [SchemaTypes.ObjectId] })
  userBanRequests?: [ObjectId | UserBanRequest];
  userBanRequestDocuments?: [UserBanRequest];
  isViolatedMessage: boolean;

  bannedReasons?: [string | ObjectId];
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
export { MessageSchema };
