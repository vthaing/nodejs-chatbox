import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BrandChannelDocument = BrandChannel & Document;
@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
    transform: (doc: BrandChannelDocument, ret) => {
      delete ret.__v;
      ret.id = ret._id;
      delete ret._id;
    },
  },
})
export class BrandChannel {
  @Prop({ required: false, type: mongoose.Schema.Types.String })
  name?: string;
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand',
  })
  brandId: string;

  @Prop({ required: true, type: mongoose.Schema.Types.String })
  externalId: string;
}

const BrandChannelSchema = SchemaFactory.createForClass(BrandChannel);

export { BrandChannelSchema };
