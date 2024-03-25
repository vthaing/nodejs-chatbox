import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, SchemaTypes } from 'mongoose';
import { User, UserSchema } from '../../user/entities/user.entity';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { Brand } from '../../brand/entities/brand.entity';

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

  @Prop({
    required: false,
    type: mongoose.Schema.Types.Boolean,
    default: true,
  })
  canUploadAttachment: boolean;

  brand?: Brand | null;
}

const ConversationSchema = SchemaFactory.createForClass(Conversation);
ConversationSchema.plugin(mongoosePaginate);

ConversationSchema.virtual('memberObjects', {
  ref: 'User',
  localField: 'members',
  foreignField: '_id',
});

ConversationSchema.virtual('brand', {
  ref: 'Brand',
  localField: 'brandId',
  foreignField: '_id',
  justOne: true,
});

ConversationSchema.virtual('showUploadAttachmentInChat').get(function ():
  | boolean
  | null {
  if (!this.brand) {
    return null;
  }
  return this.canUploadAttachment && this.brand.canUploadAttachment;
});

export { ConversationSchema };
