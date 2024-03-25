import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BrandRoomDocument = BrandRoom & Document;
@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
    transform: (doc: BrandRoomDocument, ret) => {
      delete ret.__v;
      ret.id = ret._id;
      delete ret._id;
    },
  },
})
export class BrandRoom {
  @Prop({ required: false, type: mongoose.Schema.Types.String })
  name?: string;
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand',
  })
  brandId: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BrandChannel',
  })
  brandChannelId: string;

  @Prop({ required: true, type: mongoose.Schema.Types.String })
  externalId: string;

  @Prop({ required: true, type: mongoose.Schema.Types.String })
  externalBrandChannelId: string;
}

const BrandRoomSchema = SchemaFactory.createForClass(BrandRoom);

export { BrandRoomSchema };
