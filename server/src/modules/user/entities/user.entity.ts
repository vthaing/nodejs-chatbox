import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({
  timestamps: true,
  toJSON: {
    transform: (doc: UserDocument, ret) => {
      delete ret.__v;
      ret.id = ret._id;
      delete ret._id;
      delete ret.password;
    },
  },
})
export class User {
  @Prop({ required: true, type: mongoose.Schema.Types.String })
  username: string;

  @Prop({ required: true, unique: true, type: mongoose.Schema.Types.String })
  email: string;

  @Prop({ required: true, type: mongoose.Schema.Types.String })
  password: string;

  @Prop({ type: mongoose.Schema.Types.Boolean, default: false })
  online: boolean;

  @Prop({ type: mongoose.Schema.Types.Date })
  bannedFrom?: Date | null;
  @Prop({ type: mongoose.Schema.Types.Date })
  bannedTo?: Date | null;

  isBanned: boolean;
}

const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('isBanned').get(function (): boolean {
  if (!this.bannedFrom) {
    return false;
  }
  // Banned forever
  if (!this.bannedTo) {
    return true;
  }

  return this.bannedTo > new Date();
});

export { UserSchema };
