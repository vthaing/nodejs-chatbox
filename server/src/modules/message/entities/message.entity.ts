import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from '../../user/entities/user.entity';
import { Channel } from '../../channels/entities/channel.entity';

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
  to: User | string | ObjectId;

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
}
const MessageSchema = SchemaFactory.createForClass(Message);
MessageSchema.virtual('senderInfo', {
  ref: 'User',
  localField: 'from',
  foreignField: '_id',
  justOne: true,
});

MessageSchema.virtual('messageContent').get(function () {
  return this.maskedText ?? this.text;
});

export { MessageSchema };
