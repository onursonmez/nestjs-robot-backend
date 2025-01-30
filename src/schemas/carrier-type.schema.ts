import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  collection: 'carrierTypes',
  timestamps: true,
  versionKey: false,
})
export class CarrierType extends Document {
  @Prop({ required: true })
  name: string;
}

export const CarrierTypeSchema = SchemaFactory.createForClass(CarrierType);