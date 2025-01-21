import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  collection: 'loads',
  timestamps: true,
  versionKey: false,
})
export class Load extends Document {
  @Prop({ required: true })
  name: string;
}

export const LoadSchema = SchemaFactory.createForClass(Load);