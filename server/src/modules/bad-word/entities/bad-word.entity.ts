import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import mongoose from 'mongoose';
import { BadWordCategoryEnum } from '../bad-word-category.enum';

export type BadWordDocument = BadWord & Document;

@Schema({
  timestamps: true,
  toJSON: {
    getters: true,
    transform: (doc: BadWordDocument, ret) => {
      delete ret.__v;
      ret.id = ret._id;
      delete ret._id;
    },
  },
})
export class BadWord {
  @Prop({ type: mongoose.Schema.Types.String })
  term?: string;

  @Prop({ type: mongoose.Schema.Types.Array })
  categories: [string];

  get categoriesLabel() {
    return this.categories.map(
      (category) => BadWordCategoryEnum[category] ?? null,
    );
  }
}

export const BadWordSchema = SchemaFactory.createForClass(BadWord);
