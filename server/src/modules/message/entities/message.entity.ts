import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from '../../user/entities/user.entity';

export type MessageDocument = Message & Document;

@Schema({
  timestamps: true,
  toJSON: {
    transform: (doc: MessageDocument, ret) => {
      delete ret.__v;
      ret.id = ret._id;
      delete ret._id;
    },
  },
})
export class Message {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  from: User | string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  to: User | string;

  @Prop({ required: true, type: mongoose.Schema.Types.String })
  text: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
