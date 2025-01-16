import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
collection: 'maps',
timestamps: true,
versionKey: false,
})
export class Map extends Document {
  @Prop({ required: true })
  isActive: boolean;

  @Prop({ required: true, type: [{ type: String }] })
  robotTypes: string[];

  @Prop({ type: Object })
  rosMsg: Record<string, unknown>;

  @Prop({ type: Object })
  zones: Record<string, unknown>;

  @Prop()
  imageData: string;
}

export const MapSchema = SchemaFactory.createForClass(Map);