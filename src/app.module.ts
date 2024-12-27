import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { RobotController } from './controllers/robot.controller';
import { RobotTypeController } from './controllers/robot-type.controller';
import { RobotService } from './services/robot.service';
import { RobotTypeService } from './services/robot-type.service';
import { MqttService } from './services/mqtt.service';
import { BroadcastService } from './services/broadcast.service';
import { RobotGateway } from './gateways/robot.gateway';
import { Robot, RobotSchema } from './schemas/robot.schema';
import { RobotType, RobotTypeSchema } from './schemas/robot-type.schema';
import { Map, MapSchema } from './schemas/map.schema';
import { Graph, GraphSchema } from './schemas/graph.schema';
import { MqttClient, MqttClientSchema } from './schemas/mqtt-client.schema';
import { MapController } from './controllers/map.controller';
import { GraphController } from './controllers/graph.controller';
import { MapService } from './services/map.service';
import { GraphService } from './services/graph.service';
import { MapGateway } from './gateways/map.gateway';
import { GraphGateway } from './gateways/graph.gateway';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot('mongodb://localhost:27017/fleet_manager'),
    MongooseModule.forFeature([
      { name: Robot.name, schema: RobotSchema },
      { name: MqttClient.name, schema: MqttClientSchema },
      { name: RobotType.name, schema: RobotTypeSchema },
      { name: Map.name, schema: MapSchema },
      { name: Graph.name, schema: GraphSchema },
    ]),
  ],
  controllers: [RobotController, RobotTypeController, MapController, GraphController],
  providers: [RobotService, RobotTypeService, BroadcastService, RobotGateway, MqttService, MapService, GraphService, MapGateway, GraphGateway],
})
export class AppModule {}