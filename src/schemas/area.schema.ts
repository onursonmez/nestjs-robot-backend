import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  collection: 'areas',
  timestamps: true,
  versionKey: false,
})
export class Area extends Document {
  @Prop({ required: true })
  name: string;
}

export const AreaSchema = SchemaFactory.createForClass(Area);