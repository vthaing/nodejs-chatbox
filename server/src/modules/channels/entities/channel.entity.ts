import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, SchemaTypes } from 'mongoose';
import { User } from '../../user/entities/user.entity';
import { MessageSchema } from '../../message/entities/message.entity';

export type ChannelDocument = Channel & Document;
@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
    transform: (doc: ChannelDocument, ret) => {
      delete ret.__v;
      ret.id = ret._id;
      delete ret._id;
    },
  },
})
export class Channel {
  @Prop({ required: false, type: mongoose.Schema.Types.String })
  name?: string;
  @Prop({
    required: false,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  owner: User | string;

  @Prop({ ref: 'User', type: [SchemaTypes.ObjectId] })
  members: [ObjectId];
}

const ChannelSchema = SchemaFactory.createForClass(Channel);

ChannelSchema.virtual('memberObjects', {
  ref: 'User',
  localField: 'members',
  foreignField: '_id',
});

export { ChannelSchema };
