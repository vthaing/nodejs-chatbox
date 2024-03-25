import mongoose, { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

export type MediaItemDocument = MediaItem & Document;
@Schema({
  timestamps: true,
  toJSON: {
    getters: true,
    transform: (doc: MediaItemDocument, ret) => {
      delete ret.__v;
      ret.id = ret._id;
      delete ret._id;
    },
  },
})
export class MediaItem {
  @Prop({ type: mongoose.Schema.Types.String })
  ip: string;

  @Prop({
    required: false,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  userId;
}

const MediaItemSchema = SchemaFactory.createForClass(MediaItem);
MediaItemSchema.plugin(mongoosePaginate);

export { MediaItemSchema };
