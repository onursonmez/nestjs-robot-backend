import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  collection: 'carriers',
  timestamps: true,
  versionKey: false,
})
export class Carrier extends Document {
  @Prop({ required: true })
  name: string;
}

export const CarrierSchema = SchemaFactory.createForClass(Carrier);