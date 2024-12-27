import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
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
  interfaceName: string;

  @Prop()
  version: string;

  @Prop()
  manufacturer: string;

  @Prop()
  jobId: string;

  @Prop()
  status: string;

  @Prop()
  password: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'RobotType', required: true })
  type: RobotType;

  @Prop({ type: Boolean, default: false })
  isStucked: boolean;

  @Prop({ type: Object })
  connection: Record<string, unknown>;

  @Prop({ type: Object })
  factsheet: Record<string, unknown>;

  @Prop({ type: Object })
  state: Record<string, unknown>;

  @Prop({ type: Object })
  instantActions: Record<string, unknown>;
}

export const RobotSchema = SchemaFactory.createForClass(Robot);