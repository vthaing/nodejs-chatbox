import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from '../../user/entities/user.entity';

export type UserBanRequestDocument = UserBanRequest & Document;
@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
    transform: (doc: UserBanRequestDocument, ret) => {
      delete ret.__v;
      ret.id = ret._id;
      delete ret._id;
    },
  },
})
export class UserBanRequest {
  @Prop({
    required: false,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  user: User | string;
  @Prop({ required: false, type: mongoose.Schema.Types.Number })
  duration?: number;
  @Prop({ required: false, type: mongoose.Schema.Types.String })
  reason?: string;
  type: string;
  @Prop({ required: false, type: mongoose.Schema.Types.Mixed })
  params: object;

  isBannedForever = () => {
    return this.duration === null;
  };
}

const UserBanRequestSchema = SchemaFactory.createForClass(UserBanRequest);

export { UserBanRequestSchema };
