import mongoose, { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

export type MediaItemDocument = MediaItem & Document;
@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
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
  name: string;

  @Prop({ type: mongoose.Schema.Types.Number })
  size: number;

  @Prop({ type: mongoose.Schema.Types.String })
  path: string;

  @Prop({ type: mongoose.Schema.Types.String })
  mimeType: string;

  @Prop({ type: mongoose.Schema.Types.String })
  disk: string;

  @Prop({
    required: false,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  userId;

  @Prop({
    required: false,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
  })
  messageId;

  @Prop({ required: false, type: mongoose.Schema.Types.Mixed })
  params?: any | null;

  width: number | null;
  height: number | null;
}

const MediaItemSchema = SchemaFactory.createForClass(MediaItem);

MediaItemSchema.virtual('url').get(function () {
  return '/media/' + this.id + '/' + this.name;
});

MediaItemSchema.virtual('imageWidth').get(function () {
  return this.params?.width ?? null;
});

MediaItemSchema.virtual('imageHeight').get(function () {
  return this.params?.height ?? null;
});

MediaItemSchema.plugin(mongoosePaginate);

export { MediaItemSchema };
