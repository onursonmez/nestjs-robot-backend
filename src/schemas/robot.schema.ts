import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { MqttClient } from './mqtt-client.schema';
import { RobotType } from './robot-type.schema';

@Schema({
  collection: 'robots',
  timestamps: true,
  versionKey: false,
})
export class Robot extends Document {
  @Prop({ required: true })
  serialNumber: string;

  @Prop({ required: true })
  interfaceName: string;

  @Prop({ required: true })
  version: string;

  @Prop({ required: true })
  manufacturer: string;

  @Prop()
  jobId: string;

  @Prop()
  status: string;

  @Prop()
  connectionState: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'MqttClient' })
  mqttClient: MqttClient;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'RobotType', required: true })
  robotType: RobotType;

  @Prop({ type: Boolean, default: false })
  isStucked: boolean;

  @Prop({ type: Object })
  factsheet: Record<string, unknown>;

  @Prop({ type: Object })
  state: Record<string, unknown>;

  @Prop({ type: Object })
  instantActions: Record<string, unknown>;
}

export const RobotSchema = SchemaFactory.createForClass(Robot);