import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { io, Socket } from 'socket.io-client';
import { AppModule } from '../src/app.module';
import { Model } from 'mongoose';
import { Robot } from '../src/schemas/robot.schema';
import { RobotType } from '../src/schemas/robot-type.schema';
import { getModelToken } from '@nestjs/mongoose';

describe('RobotController (Socket.IO)', () => {
  let app: INestApplication;
  let robotModel: Model<Robot>;
  let robotTypeModel: Model<RobotType>;
  let socket: Socket;
  const TEST_PORT = 3001;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    robotModel = moduleFixture.get<Model<Robot>>(getModelToken(Robot.name));
    robotTypeModel = moduleFixture.get<Model<RobotType>>(getModelToken(RobotType.name));
    
    await app.listen(TEST_PORT);

    socket = io(`http://localhost:${TEST_PORT}`, {
      reconnectionDelay: 0,
      forceNew: true,
      transports: ['websocket'],
      timeout: 10000
    });

    // Wait for socket connection with timeout
    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Socket connection timeout'));
      }, 5000);

      socket.on('connect', () => {
        clearTimeout(timeout);
        resolve();
      });

      socket.on('connect_error', (err) => {
        clearTimeout(timeout);
        reject(err);
      });
    });
  });

  beforeEach(async () => {
    await robotModel.deleteMany({}).exec();
    await robotTypeModel.deleteMany({}).exec();
  });

  afterEach(() => {
    socket.removeAllListeners();
  });

  afterAll(async () => {
    if (socket.connected) {
      socket.disconnect();
    }
    await app.close();
  });

  describe('Socket.IO Events', () => {
    it('should receive all robots on connection', async () => {
      const robotType = await robotTypeModel.create({ name: 'TestType' });
      await robotModel.create([
        { serialNumber: 'TEST-001', robotType: robotType._id },
        { serialNumber: 'TEST-002', robotType: robotType._id }
      ]);

      return new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Timeout waiting for allRobots event'));
        }, 5000);

        socket.on('allRobots', (robots) => {
          clearTimeout(timeout);
          try {
            expect(Array.isArray(robots)).toBeTruthy();
            expect(robots.length).toBe(2);
            resolve();
          } catch (error) {
            reject(error);
          }
        });
      });
    }, 10000);

    it('should create a robot via socket', async () => {
      const robotType = await robotTypeModel.create({ name: 'TestType' });

      return new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Timeout waiting for robotCreated event'));
        }, 5000);

        socket.on('robotCreated', (robot) => {
          clearTimeout(timeout);
          try {
            expect(robot.serialNumber).toBe('TEST-001');
            expect(robot.robotType._id.toString()).toBe(robotType._id.toString());
            resolve();
          } catch (error) {
            reject(error);
          }
        });

        socket.emit('createRobot', {
          serialNumber: 'TEST-001',
          robotType: robotType._id.toString()
        });
      });
    }, 10000);

    it('should delete a robot via socket', async () => {
      const robotType = await robotTypeModel.create({ name: 'TestType' });
      const robot = await robotModel.create({
        serialNumber: 'TEST-001',
        robotType: robotType._id
      });

      return new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Timeout waiting for robotDeleted event'));
        }, 5000);

        socket.on('robotDeleted', async (deletedId) => {
          clearTimeout(timeout);
          try {
            expect(deletedId).toBe(robot._id.toString());
            const deletedRobot = await robotModel.findById(robot._id);
            expect(deletedRobot).toBeNull();
            resolve();
          } catch (error) {
            reject(error);
          }
        });

        socket.emit('removeRobot', robot._id.toString());
      });
    }, 10000);
  });
});