import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  collection: 'nodeActionTypes',
  timestamps: true,
  versionKey: false,
})
export class NodeActionType extends Document {
  @Prop({ required: true })
  name: string;
}

export const NodeActionTypeSchema = SchemaFactory.createForClass(NodeActionType);