import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Robot } from '../schemas/robot.schema';
import { CreateRobotDto } from '../dto/create-robot.dto';
import { UpdateRobotDto } from '../dto/update-robot.dto';

@Injectable()
export class RobotService {
  constructor(
    @InjectModel(Robot.name) private robotModel: Model<Robot>
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
    const createdRobot = new this.robotModel(createRobotDto);
    await createdRobot.populate('type');
    return createdRobot.save();
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
}