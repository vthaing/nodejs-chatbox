import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, SchemaTypes } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { UserIpEntity } from './user-ip.entity';

export type UserDocument = User & Document;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
    transform: (doc: UserDocument, ret) => {
      delete ret.__v;
      ret.id = ret._id;
      delete ret._id;
      delete ret.password;
    },
  },
})
export class User {
  @Prop({ type: mongoose.Schema.Types.String })
  username: string;

  @Prop({ type: mongoose.Schema.Types.String })
  email: string;

  @Prop({ type: mongoose.Schema.Types.String })
  password: string;

  @Prop({
    required: false,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand',
  })
  brandId?: string;
  @Prop({ required: false, type: mongoose.Schema.Types.String })
  externalId: string;
  @Prop({ required: false, type: mongoose.Schema.Types.Boolean, default: true })
  brandStatus?: boolean;

  @Prop({ required: false, type: mongoose.Schema.Types.String })
  displayName?: string;

  @Prop({ type: mongoose.Schema.Types.Boolean, default: false })
  online: boolean;

  @Prop({ type: mongoose.Schema.Types.Date })
  bannedFrom?: Date | null;
  @Prop({ type: mongoose.Schema.Types.Date })
  bannedTo?: Date | null;

  isBanned: boolean;

  @Prop({ ref: 'UserBanRequest', type: [SchemaTypes.ObjectId] })
  userBanRequestIds: [ObjectId];

  @Prop({ type: mongoose.Schema.Types.Array })
  roles: [string];
  @Prop({ type: mongoose.Schema.Types.Array })
  ipHistory?: UserIpEntity[] | null;
}

const UserSchema = SchemaFactory.createForClass(User);

UserSchema.plugin(mongoosePaginate);

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

UserSchema.virtual('brand', {
  ref: 'Brand',
  localField: 'brandId',
  foreignField: 'id',
  justOne: true,
});

export { UserSchema };
