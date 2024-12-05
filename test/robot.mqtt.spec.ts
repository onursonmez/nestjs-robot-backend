import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as mqtt from 'mqtt';
import { AppModule } from '../src/app.module';
import { Model } from 'mongoose';
import { Robot } from '../src/schemas/robot.schema';
import { RobotType } from '../src/schemas/robot-type.schema';
import { getModelToken } from '@nestjs/mongoose';

describe('RobotController (MQTT)', () => {
  let app: INestApplication;
  let robotModel: Model<Robot>;
  let robotTypeModel: Model<RobotType>;
  let mqttClient: mqtt.MqttClient;

  beforeAll(async () => {
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
    mqttClient.end();
    await app.close();
  });

  describe('MQTT Topics', () => {
    it('should receive robot creation notification via MQTT', async () => {
      const robotType = await robotTypeModel.create({ name: 'TestType' });

      return new Promise((resolve) => {
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
        robotModel.create({
          serialNumber: 'TEST-001',
          robotType: robotType._id,
        });
      });
    });

    it('should receive robot deletion notification via MQTT', async () => {
      const robotType = await robotTypeModel.create({ name: 'TestType' });
      const robot = await robotModel.create({
        serialNumber: 'TEST-001',
        robotType: robotType._id,
      });

      return new Promise((resolve) => {
        mqttClient.subscribe('robots/deleted');

        mqttClient.on('message', (topic, message) => {
          if (topic === 'robots/deleted') {
            const deletedId = message.toString();
            expect(deletedId).toBe(robot._id.toString());
            resolve(true);
          }
        });

        // Delete the robot through the model to trigger MQTT notification
        robotModel.findByIdAndDelete(robot._id).exec();
      });
    });

    it('should receive all robots via MQTT', async () => {
      const robotType = await robotTypeModel.create({ name: 'TestType' });
      await robotModel.create([
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
        app.get('BroadcastService').broadcastAllRobots();
      });
    });
  });
});