import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from '../../user/entities/user.entity';
import { getUserBanRequestLabelById } from '../enum/user-ban-request-type.enum';

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
  userId: User | string;
  @Prop({ required: false, type: mongoose.Schema.Types.Number })
  duration?: number;
  @Prop({ required: false, type: mongoose.Schema.Types.String })
  reason?: string;
  @Prop({ required: false, type: mongoose.Schema.Types.String })
  type: string;
  @Prop({ required: false, type: mongoose.Schema.Types.Mixed })
  params: object;

  get isBannedForever() {
    return this.duration === null;
  }
}

const UserBanRequestSchema = SchemaFactory.createForClass(UserBanRequest);

UserBanRequestSchema.virtual('typeLabel').get(function () {
  return getUserBanRequestLabelById(this.type);
});

export { UserBanRequestSchema };
