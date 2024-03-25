import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, SchemaTypes } from 'mongoose';
import { User } from '../../user/entities/user.entity';

export type ConversationDocument = Conversation & Document;
@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
    transform: (doc: ConversationDocument, ret) => {
      delete ret.__v;
      ret.id = ret._id;
      delete ret._id;
    },
  },
})
export class Conversation {
  @Prop({ required: false, type: mongoose.Schema.Types.String })
  name?: string;
  @Prop({
    required: false,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  owner: User | string;

  @Prop({
    required: false,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand',
  })
  brandId: string;

  @Prop({
    required: false,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BrandChannel',
  })
  brandChannelId?: string | null;
  @Prop({
    required: false,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BrandRoom',
  })
  brandRoomId?: string | null;

  @Prop({ ref: 'User', type: [SchemaTypes.ObjectId] })
  members: [ObjectId];
}

const ConversationSchema = SchemaFactory.createForClass(Conversation);

ConversationSchema.virtual('memberObjects', {
  ref: 'User',
  localField: 'members',
  foreignField: '_id',
});

export { ConversationSchema };
