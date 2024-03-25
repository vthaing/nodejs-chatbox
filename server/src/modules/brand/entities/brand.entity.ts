import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, ObjectId, SchemaTypes } from 'mongoose';

export type BrandDocument = Brand & Document;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
    transform: (doc: BrandDocument, ret) => {
      delete ret.__v;
      ret.id = ret._id;
      delete ret._id;
    },
  },
})
export class Brand {
  @Prop({ required: false, type: mongoose.Schema.Types.String })
  name?: string;
  @Prop({
    required: false,
    type: mongoose.Schema.Types.String,
  })
  externalId: string;

  @Prop({
    required: false,
    type: mongoose.Schema.Types.String,
  })
  secretKey: string;
  @Prop({
    required: false,
    type: mongoose.Schema.Types.Boolean,
  })
  enabled: boolean;
}

export const BrandSchema = SchemaFactory.createForClass(Brand);