import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { RobotController } from './controllers/robot.controller';
import { RobotTypeController } from './controllers/robot-type.controller';
import { NodeActionTypeController } from './controllers/node-action-type.controller';
import { RobotService } from './services/robot.service';
import { RobotTypeService } from './services/robot-type.service';
import { NodeActionTypeService } from './services/node-action-type.service';
import { MqttService } from './services/mqtt.service';
import { BroadcastService } from './services/broadcast.service';
import { RobotGateway } from './gateways/robot.gateway';
import { RobotTypeGateway } from './gateways/robot-type.gateway';
import { Robot, RobotSchema } from './schemas/robot.schema';
import { RobotType, RobotTypeSchema } from './schemas/robot-type.schema';
import { NodeActionType, NodeActionTypeSchema } from './schemas/node-action-type.schema';
import { Map, MapSchema } from './schemas/map.schema';
import { Graph, GraphSchema } from './schemas/graph.schema';
import { MapController } from './controllers/map.controller';
import { GraphController } from './controllers/graph.controller';
import { MapService } from './services/map.service';
import { MapGenerateService } from './services/map-generate.service';
import { GraphService } from './services/graph.service';
import { MapGateway } from './gateways/map.gateway';
import { GraphGateway } from './gateways/graph.gateway';
import { NodeActionTypeGateway } from './gateways/node-action-type.gateway';

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
    ]),
  ],
  controllers: [RobotController, RobotTypeController, MapController, GraphController, NodeActionTypeController],
  providers: [RobotService, RobotTypeService, BroadcastService, RobotGateway, RobotTypeGateway, NodeActionTypeGateway, MqttService, MapService, MapGenerateService, GraphService, MapGateway, GraphGateway, NodeActionTypeService],
})
export class AppModule { }