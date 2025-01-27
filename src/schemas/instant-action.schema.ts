import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type InstantActionDocument = HydratedDocument<InstantAction>;

@Schema()
export class ActionParameter {
  @Prop({ required: true })
  key: string;

  @Prop({ required: true, type: MongooseSchema.Types.Mixed })
  value: any;
}

@Schema()
export class Action {
  @Prop({ required: true })
  actionType: string;

  @Prop({ required: true })
  actionId: string;

  @Prop()
  actionDescription?: string;

  @Prop({ required: true, enum: ['NONE', 'SOFT', 'HARD'] })
  blockingType: string;

  @Prop({ type: [SchemaFactory.createForClass(ActionParameter)] })
  actionParameters?: ActionParameter[];
}

@Schema({
  collection: 'instantActions',
  timestamps: true,
  versionKey: false,
})
export class InstantAction {
  @Prop({ required: true, type: Number })
  headerId: number;

  @Prop({ required: true })
  timestamp: string;

  @Prop({ required: true })
  version: string;

  @Prop({ required: true })
  manufacturer: string;

  @Prop({ required: true })
  serialNumber: string;

  @Prop({ type: [SchemaFactory.createForClass(Action)], required: true })
  actions: Action[];
}

export const InstantActionSchema = SchemaFactory.createForClass(InstantAction);