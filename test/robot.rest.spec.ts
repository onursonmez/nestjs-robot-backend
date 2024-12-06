import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Model } from 'mongoose';
import { Robot } from '../src/schemas/robot.schema';
import { RobotType } from '../src/schemas/robot-type.schema';
import { getModelToken } from '@nestjs/mongoose';

describe('RobotController (REST)', () => {
  let app: INestApplication;
  let robotModel: Model<Robot>;
  let robotTypeModel: Model<RobotType>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    robotModel = moduleFixture.get<Model<Robot>>(getModelToken(Robot.name));
    robotTypeModel = moduleFixture.get<Model<RobotType>>(getModelToken(RobotType.name));
    await app.init();
  });

  beforeEach(async () => {
    await robotModel.deleteMany({});
    await robotTypeModel.deleteMany({});
  });

  afterAll(async () => {
    await app.close();
  });

  describe('REST API', () => {
    it('should create a robot type and a robot', async () => {
      // First create a robot type
      const robotTypeResponse = await request(app.getHttpServer())
        .post('/robot-types')
        .send({ name: 'TestType' })
        .expect(201);

      const robotTypeId = robotTypeResponse.body._id;

      // Then create a robot with the robot type
      const createRobotResponse = await request(app.getHttpServer())
        .post('/robots')
        .send({
          serialNumber: 'TEST-001',
          robotType: robotTypeId,
          status: 'IDLE',
        })
        .expect(201);

      expect(createRobotResponse.body.serialNumber).toBe('TEST-001');
      expect(createRobotResponse.body.robotType._id).toBe(robotTypeId);
    });

    it('should list all robots', async () => {
      // Create a robot type first
      const robotType = await robotTypeModel.create({ name: 'TestType' });

      // Create test robots
      await robotModel.create([
        { serialNumber: 'TEST-001', robotType: robotType._id },
        { serialNumber: 'TEST-002', robotType: robotType._id },
      ]);

      const response = await request(app.getHttpServer())
        .get('/robots')
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0].serialNumber).toBe('TEST-001');
      expect(response.body[1].serialNumber).toBe('TEST-002');
    });

    it('should delete a robot', async () => {
      // Create a robot type first
      const robotType = await robotTypeModel.create({ name: 'TestType' });

      // Create a test robot
      const robot = await robotModel.create({
        serialNumber: 'TEST-001',
        robotType: robotType._id,
      });

      await request(app.getHttpServer())
        .delete(`/robots/${robot._id}`)
        .expect(200);

      const deletedRobot = await robotModel.findById(robot._id);
      expect(deletedRobot).toBeNull();
    });
  });
});