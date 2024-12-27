import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
collection: 'maps',
timestamps: true,
versionKey: false,
})
export class Map extends Document {
  @Prop({ required: true })
  mapId: string;

  @Prop({ required: true })
  isActive: boolean;

  @Prop({ required: true, type: [{ type: String }] })
  robotTypes: string[];

  @Prop({ type: Object })
  header: Record<string, unknown>;

  @Prop({ type: Object })
  info: Record<string, unknown>;

  @Prop({ type: Object })
  zones: Record<string, unknown>;

  @Prop({ required: true, type: [{ type: Number }] })
  data: number[];

  @Prop({ required: true })
  imageData: string;
}

export const MapSchema = SchemaFactory.createForClass(Map);