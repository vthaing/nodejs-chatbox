import mongoose, { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { ApiProperty } from '@nestjs/swagger';

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
      delete ret.path;
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
  @ApiProperty()
  mimeType: string;

  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.String })
  disk: string;

  @Prop({
    required: false,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  @ApiProperty()
  userId;

  @ApiProperty()
  @Prop({
    required: false,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
  })
  messageId;

  @Prop({ required: false, type: mongoose.Schema.Types.Mixed })
  @ApiProperty()
  params?: any | null;

  @ApiProperty()
  width: number | null;
  @ApiProperty()
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
