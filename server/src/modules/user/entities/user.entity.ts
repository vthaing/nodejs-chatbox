import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({
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
}

export const UserSchema = SchemaFactory.createForClass(User);

// UserSchema.pre(['save', 'updateOne'], function (next: () => void) {
//   const user = this as UserDocument;
//   if (!user.isModified('password')) return next();
//   const salt = bcrypt.genSaltSync();
//   user.password = bcrypt.hashSync(user.password, salt);
//   next();
// });

// UserSchema.pre('updateOne', function (next: () => void) {
//   const user = this as UserDocument;
//   const salt = bcrypt.genSaltSync();
//   user.password = bcrypt.hashSync(user.password, salt);
// });
