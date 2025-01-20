import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { BroadcastService } from './services/broadcast.service';
import { RobotController } from './controllers/robot.controller';
import { RobotService } from './services/robot.service';
import { RobotGateway } from './gateways/robot.gateway';
import { Robot, RobotSchema } from './schemas/robot.schema';
import { RobotTypeController } from './controllers/robot-type.controller';
import { RobotTypeService } from './services/robot-type.service';
import { RobotTypeGateway } from './gateways/robot-type.gateway';
import { RobotType, RobotTypeSchema } from './schemas/robot-type.schema';
import { NodeActionTypeController } from './controllers/node-action-type.controller';
import { NodeActionTypeService } from './services/node-action-type.service';
import { NodeActionTypeGateway } from './gateways/node-action-type.gateway';
import { NodeActionType, NodeActionTypeSchema } from './schemas/node-action-type.schema';
import { MqttService } from './services/mqtt.service';
import { MapController } from './controllers/map.controller';
import { MapService } from './services/map.service';
import { MapGateway } from './gateways/map.gateway';
import { Map, MapSchema } from './schemas/map.schema';
import { MapGenerateService } from './services/map-generate.service';
import { GraphController } from './controllers/graph.controller';
import { GraphService } from './services/graph.service';
import { GraphGateway } from './gateways/graph.gateway';
import { Graph, GraphSchema } from './schemas/graph.schema';
import { JobController } from './controllers/job.controller';
import { JobService } from './services/job.service';
import { JobGateway } from './gateways/job.gateway';
import { Job, JobSchema } from './schemas/job.schema';
@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot('mongodb://admin:patika@88.198.66.88:27017/fleet_manager?authSource=admin'),
    MongooseModule.forFeature([
      { name: Robot.name, schema: RobotSchema },
      { name: RobotType.name, schema: RobotTypeSchema },
      { name: NodeActionType.name, schema: NodeActionTypeSchema },
      { name: Map.name, schema: MapSchema },
      { name: Graph.name, schema: GraphSchema },
      { name: Job.name, schema: JobSchema },
    ]),
  ],
  controllers: [RobotController, RobotTypeController, MapController, GraphController, NodeActionTypeController, JobController],
  providers: [RobotService, RobotTypeService, BroadcastService, RobotGateway, RobotTypeGateway, NodeActionTypeGateway, MqttService, MapService, MapGenerateService, GraphService, MapGateway, GraphGateway, NodeActionTypeService, JobService, JobGateway],
})
export class AppModule { }