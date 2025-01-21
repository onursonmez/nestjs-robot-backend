import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Load } from './load.schema';

export type JobDocument = HydratedDocument<Job>;

@Schema()
export class Target {
  @Prop({ required: true })
  targetId: string;

  @Prop({ required: true })
  isArea: boolean;

  @Prop({ required: true })
  filterByLoadId: boolean;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Load' })
  load: Load;
  
  @Prop({ required: true })
  nodeActionType: string;
}

@Schema()
export class Task {
  @Prop({ required: true })
  startNodeId: string;

  @Prop({ required: true })
  endNodeId: string;

  @Prop({ required: true })
  nodeActionType: string;

  @Prop({ required: true, enum: ["WAITING_FOR_PART_ARRIVAL", "SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELED", "DELETED", "PAUSED"] })
  taskStatus: string;

  @Prop({ required: true })
  startAt: Date;

  @Prop({ required: true })
  endAt: Date;
}

@Schema()
export class VisitedNode {
  @Prop({ required: true })
  nodeId: string;

  @Prop({ required: true })
  visitedAt: Date;
}

@Schema({
  collection: 'jobs',
  timestamps: true,
  versionKey: false,
  })
export class Job {
  @Prop({ required: true })
  graphId: string;

  @Prop({ required: true })
  trackCarrierPosition: boolean;

  @Prop()
  serialNumber?: string;

  @Prop({ type: [String] })
  robotTypes?: string[];

  @Prop()
  startAt?: Date;

  @Prop()
  endAt?: Date;

  @Prop({ type: [SchemaFactory.createForClass(Target)], required: true })
  targets: Target[];

  @Prop({ type: [SchemaFactory.createForClass(Task)] })
  tasks?: Task[];

  @Prop({ type: [SchemaFactory.createForClass(VisitedNode)] })
  visitedNodes?: VisitedNode[];

  @Prop({ required: true, default: 0 })
  priority: number;

  @Prop({ required: true, enum: ["WAITING_FOR_PART_ARRIVAL", "SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELED", "DELETED", "PAUSED"] })
  jobStatus: string;
}

export const JobSchema = SchemaFactory.createForClass(Job);
