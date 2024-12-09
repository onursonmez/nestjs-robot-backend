import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as mqtt from 'mqtt';
import { AppModule } from '../src/app.module';
import { Model } from 'mongoose';
import { Robot } from '../src/schemas/robot.schema';
import { RobotType } from '../src/schemas/robot-type.schema';
import { getModelToken } from '@nestjs/mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { getConnectionToken } from '@nestjs/mongoose';

describe('RobotController (MQTT)', () => {
  let app: INestApplication;
  let robotModel: Model<Robot>;
  let robotTypeModel: Model<RobotType>;
  let mqttClient: mqtt.MqttClient;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    robotModel = moduleFixture.get<Model<Robot>>(getModelToken(Robot.name));
    robotTypeModel = moduleFixture.get<Model<RobotType>>(getModelToken(RobotType.name));
    await app.init();

    mqttClient = mqtt.connect('mqtt://localhost:1883', {
      clientId: `test-client-${Math.random().toString(16).slice(3)}`,
    });

    await new Promise((resolve) => mqttClient.on('connect', resolve));
  });

  beforeEach(async () => {
    await robotModel.deleteMany({});
    await robotTypeModel.deleteMany({});
  });

  afterAll(async () => {
    const connection = app.get(getConnectionToken());
    await connection.close();
    mqttClient.end(true);
    await app.close();
  });

  describe('MQTT Topics', () => {
    it('should MQTT send and receive message', async () => {

      return new Promise((resolve) => {
        mqttClient.subscribe('mqtt/test');

        mqttClient.on('message', (topic, message) => {
          if (topic === 'mqtt/test') {
            const test = JSON.parse(message.toString());
            expect(test).toBe('test');
            resolve(true);
          }
        });

        mqttClient.publish('mqtt/test', JSON.stringify("test"));
      });
    });
    
    it('should receive robot creation notification via MQTT', async () => {
      const robotType = await robotTypeModel.create({ name: 'TestType' });

      return new Promise(async (resolve) => {
        mqttClient.subscribe('robots/created');

        mqttClient.on('message', (topic, message) => {
          if (topic === 'robots/created') {
            const robot = JSON.parse(message.toString());
            expect(robot.serialNumber).toBe('TEST-001');
            expect(robot.robotType.toString()).toBe(robotType._id.toString());
            resolve(true);
          }
        });

        // Create a robot through the model to trigger MQTT notification
        const robot = await robotModel.create({
          serialNumber: 'TEST-001',
          robotType: robotType._id,
        });

        mqttClient.publish('robots/created', JSON.stringify(robot));
      });
    });

    it('should receive robot deletion notification via MQTT', async () => {
      const robotType = await robotTypeModel.create({ name: 'TestType' });
      const robot = await robotModel.create({
        serialNumber: 'TEST-001',
        robotType: robotType._id,
      });

      return new Promise(async (resolve) => {
        mqttClient.subscribe('robots/deleted');

        mqttClient.on('message', (topic, message) => {
          if (topic === 'robots/deleted') {
            const deletedRobot = JSON.parse(message.toString());
            expect(deletedRobot._id).toBe(robot._id.toString());
            resolve(true);
          }
        });

        // Delete the robot through the model to trigger MQTT notification
        const deletedRobot = await robotModel.findByIdAndDelete(robot._id).exec();      
        
        mqttClient.publish('robots/deleted', JSON.stringify(deletedRobot));
      });
    });

    it('should receive all robots via MQTT', async () => {
      const robotType = await robotTypeModel.create({ name: 'TestType' });
      const robots = await robotModel.create([
        { serialNumber: 'TEST-001', robotType: robotType._id },
        { serialNumber: 'TEST-002', robotType: robotType._id },
      ]);

      return new Promise((resolve) => {
        mqttClient.subscribe('robots/all');

        mqttClient.on('message', (topic, message) => {
          if (topic === 'robots/all') {
            const robots = JSON.parse(message.toString());
            expect(Array.isArray(robots)).toBeTruthy();
            expect(robots).toHaveLength(2);
            expect(robots[0].serialNumber).toBe('TEST-001');
            expect(robots[1].serialNumber).toBe('TEST-002');
            resolve(true);
          }
        });

        // Trigger a broadcast of all robots
        mqttClient.publish('robots/all', JSON.stringify(robots));
      });
    });

    it('should handle mastercontrol robot publish mqtt message', async () => {
      const robotType = await robotTypeModel.create({ name: 'TestType' });
      const robots = await robotModel.create([
        { serialNumber: 'TEST-001', robotType: robotType._id },
        { serialNumber: 'TEST-002', robotType: robotType._id },
      ]);

      return new Promise((resolve) => {
        mqttClient.subscribe('robots/publish');

        mqttClient.on('message', (topic, message) => {
          if (topic === 'robots/publish') {
            const robots = JSON.parse(message.toString());
            expect(Array.isArray(robots)).toBeTruthy();
            expect(robots).toHaveLength(2);
            expect(robots[0].serialNumber).toBe('TEST-001');
            expect(robots[1].serialNumber).toBe('TEST-002');
            resolve(true);
          }
        });

        // Trigger a broadcast of all robots
        mqttClient.publish('robots/publish', JSON.stringify(robots));
      });
    });

  });
});