import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  collection: 'robotTypes',
  timestamps: true,
  versionKey: false,
})
export class RobotType extends Document {
  @Prop({ required: true })
  name: string;
}

export const RobotTypeSchema = SchemaFactory.createForClass(RobotType);