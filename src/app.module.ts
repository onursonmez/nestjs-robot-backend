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
import { MqttClient, MqttClientSchema } from './schemas/mqtt-client.schema';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot('mongodb://localhost:27017/fleet_manager'),
    MongooseModule.forFeature([
      { name: Robot.name, schema: RobotSchema },
      { name: MqttClient.name, schema: MqttClientSchema },
      { name: RobotType.name, schema: RobotTypeSchema },
    ]),
  ],
  controllers: [RobotController, RobotTypeController],
  providers: [RobotService, RobotTypeService, BroadcastService, RobotGateway, MqttService],
})
export class AppModule {}