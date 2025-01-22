import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { Robot } from '../schemas/robot.schema';
import { CreateRobotDto } from '../dto/create-robot.dto';
import { UpdateRobotDto } from '../dto/update-robot.dto';
import { exec } from 'child_process';

@Injectable()
export class RobotService {
  private mosquittoPasswordFile = '/etc/mosquitto/passwordfile';
  constructor(
    @InjectModel(Robot.name) private robotModel: Model<Robot>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async findAll(): Promise<Robot[]> {
    return this.robotModel
      .find()
      .populate('type')
      .exec();
  }

  async findOne(id: string): Promise<Robot | null> {
    return this.robotModel
      .findById(id)
      .populate('type')
      .exec();
  }

  async create(createRobotDto: CreateRobotDto): Promise<Robot> {
    const session = await this.connection.startSession(); // Transaction başlat
    session.startTransaction();

    try {
      // İlk işlem: Robot'u oluştur ve kaydet
      const createdRobot = new this.robotModel(createRobotDto);
      await createdRobot.populate('type');
      const savedRobot = await createdRobot.save({ session });

      // İkinci işlem: Mosquitto kullanıcısını ekle
      await this.addMosquittoUser(savedRobot.serialNumber, savedRobot.password);

      // İşlem başarılı, transaction'ı commit et
      await session.commitTransaction();
      session.endSession();

      return savedRobot;
    } catch (error) {
      // Hata durumunda transaction'ı geri al
      await session.abortTransaction();
      session.endSession();
      throw new InternalServerErrorException('Hata oluştu: ' + error.message);
    }
  }

  async update(id: string, updateRobotDto: UpdateRobotDto): Promise<Robot | null> {
    return this.robotModel
      .findByIdAndUpdate(id, updateRobotDto, { new: true })
      .populate('type')
      .exec();
  }

  async delete(id: string): Promise<Robot | null> {
    return this.robotModel.findByIdAndDelete(id).exec();
  }

  /* 
  * Robots are compared in the database. 
  * Matches are updated, unmatches are returned
  */
  async compareRobotsFromDB(robots: Robot[]): Promise<Robot[] | null> {

    const dbRobots = await this.robotModel.find({ serialNumber: { $in: robots.map(r => r.serialNumber) } });
    const missmatchedRobots: Robot[] = robots.filter(r => !dbRobots.some(dbR => dbR.serialNumber === r.serialNumber));
    return missmatchedRobots;


    // const missmatchedRobots: Robot[] = [];
    // for (const robot of robots) {
    //   const dbRobot = await this.robotModel.findOne({ serialNumber: robot.serialNumber });
    //   if (dbRobot) {
    //     await this.robotModel.findByIdAndUpdate(dbRobot._id, { status: robot.status, connectionState: robot.connectionState });
    //   } else {
    //     missmatchedRobots.push(robot);
    //   }
    // }
    // return missmatchedRobots;
  }

  addMosquittoUser(username: string, password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const command = `mosquitto_passwd -b ${this.mosquittoPasswordFile} ${username} ${password}`;
      exec(command, (error, stdout, stderr) => {
        if (error) {
          return reject(stderr || error.message);
        }
        resolve(`Mosquitto user "${username}" added successfully.`);
      });
    });
  }

  updateMosquittoUser(username: string, newPassword: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const command = `mosquitto_passwd -b ${this.mosquittoPasswordFile} ${username} ${newPassword}`;
      exec(command, (error, stdout, stderr) => {
        if (error) {
          return reject(stderr || error.message);
        }
        resolve(`Mosquitto user "${username}" updated successfully.`);
      });
    });
  }

  deleteMosquittoUser(username: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const command = `sed -i '/^${username}:/d' ${this.mosquittoPasswordFile}`;
      exec(command, (error, stdout, stderr) => {
        if (error) {
          return reject(stderr || error.message);
        }
        resolve(`User "${username}" deleted successfully.`);
      });
    });
  }
}