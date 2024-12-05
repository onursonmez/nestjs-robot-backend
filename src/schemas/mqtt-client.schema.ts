import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  collection: 'mqttClients',
  timestamps: true,
  versionKey: false,
})
export class MqttClient extends Document {
  @Prop({ required: true, unique: true })
  clientId: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;
}

export const MqttClientSchema = SchemaFactory.createForClass(MqttClient);