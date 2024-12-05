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

  @Prop()
  url: string;

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
}

export const RobotSchema = SchemaFactory.createForClass(Robot);