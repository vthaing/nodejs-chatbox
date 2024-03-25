import mongoose, { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

export type RestrictedIpDocument = RestrictedIp & Document;
@Schema({
  timestamps: true,
  toJSON: {
    getters: true,
    transform: (doc: RestrictedIpDocument, ret) => {
      delete ret.__v;
      ret.id = ret._id;
      delete ret._id;
    },
  },
})
export class RestrictedIp {
  @Prop({ type: mongoose.Schema.Types.String })
  ip: string;

  @Prop({ type: mongoose.Schema.Types.Boolean })
  enabled: boolean;

  @Prop({ type: mongoose.Schema.Types.String })
  notes?: string;
}

const RestrictedIpSchema = SchemaFactory.createForClass(RestrictedIp);
RestrictedIpSchema.plugin(mongoosePaginate);

export { RestrictedIpSchema };
