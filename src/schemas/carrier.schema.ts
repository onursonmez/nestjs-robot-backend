import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { CarrierType } from './carrier-type.schema';

@Schema({
  collection: 'carriers',
  timestamps: true,
  versionKey: false,
})
export class Carrier extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'CarrierType', required: true })
  type: CarrierType;

  @Prop()
  stationId: string;

  @Prop()
  jobId: string;

  @Prop()
  status: string;

  @Prop()
  loadId: string;
}

export const CarrierSchema = SchemaFactory.createForClass(Carrier);