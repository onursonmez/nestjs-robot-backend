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

import { AreaController } from './controllers/area.controller';
import { AreaService } from './services/area.service';
import { AreaGateway } from './gateways/area.gateway';
import { Area, AreaSchema } from './schemas/area.schema';

import { LoadController } from './controllers/load.controller';
import { LoadService } from './services/load.service';
import { LoadGateway } from './gateways/load.gateway';
import { Load, LoadSchema } from './schemas/load.schema';

import { CarrierController } from './controllers/carrier.controller';
import { CarrierService } from './services/carrier.service';
import { CarrierGateway } from './gateways/carrier.gateway';
import { Carrier, CarrierSchema } from './schemas/carrier.schema';

import { JobTemplateController } from './controllers/job-template.controller';
import { JobTemplateService } from './services/job-template.service';
import { JobTemplateGateway } from './gateways/job-template.gateway';
import { JobTemplate, JobTemplateSchema } from './schemas/job-template.schema';

import { InstantActionController } from './controllers/instant-action.controller';
import { InstantActionService } from './services/instant-action.service';
import { InstantActionGateway } from './gateways/instant-action.gateway';
import { InstantAction, InstantActionSchema } from './schemas/instant-action.schema';
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
      { name: JobTemplate.name, schema: JobTemplateSchema },
      { name: Load.name, schema: LoadSchema },
      { name: Carrier.name, schema: CarrierSchema },
      { name: Area.name, schema: AreaSchema },
      { name: InstantAction.name, schema: InstantActionSchema },
    ]),
  ],
  controllers: [RobotController, RobotTypeController, MapController, GraphController, NodeActionTypeController, JobController, LoadController, CarrierController, AreaController, JobTemplateController, InstantActionController],
  providers: [RobotService, RobotTypeService, BroadcastService, RobotGateway, RobotTypeGateway, NodeActionTypeGateway, MqttService, MapService, MapGenerateService, GraphService, MapGateway, GraphGateway, NodeActionTypeService, JobService, JobGateway, LoadService, LoadGateway, CarrierService, CarrierGateway, AreaService, AreaGateway, JobTemplateService, JobTemplateGateway, InstantActionService, InstantActionGateway],
})
export class AppModule { }