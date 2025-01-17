import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { RobotType } from '../schemas/robot-type.schema';
import { CreateRobotTypeDto } from '../dto/create-robot-type.dto';
import { UpdateRobotTypeDto } from '../dto/update-robot-type.dto';

@Injectable()
export class RobotTypeService {
  constructor(
    @InjectModel(RobotType.name) private robotTypeModel: Model<RobotType>,
  ) {}

  async findAll(): Promise<RobotType[]> {
    return this.robotTypeModel.find().exec();
  }

  async findOne(id: string): Promise<RobotType> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid robot type ID format');
    }
    return this.robotTypeModel.findById(id).exec();
  }

  async create(createRobotTypeDto: CreateRobotTypeDto): Promise<RobotType> {
    const createdRobotType = new this.robotTypeModel(createRobotTypeDto);
    return createdRobotType.save();
  }

  async update(id: string, updateRobotTypeDto: UpdateRobotTypeDto): Promise<RobotType> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid robot type ID format');
    }
    return this.robotTypeModel
      .findByIdAndUpdate(id, updateRobotTypeDto, { new: true })
      .exec();
  }

  async delete(id: string): Promise<RobotType> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid robot type ID format');
    }
    return this.robotTypeModel.findByIdAndDelete(id).exec();
  }
}