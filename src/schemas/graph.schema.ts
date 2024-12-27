import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
collection: 'graphs',
timestamps: true,
versionKey: false,
})
export class Graph extends Document {
  @Prop({ required: true })
  mapId: string;

  @Prop({ required: true })
  isActive: boolean;

  @Prop({ type: Object })
  nodes: Record<string, unknown>;

  @Prop({ type: Object })
  edges: Record<string, unknown>;
}

export const GraphSchema = SchemaFactory.createForClass(Graph);