import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Load } from '../schemas/load.schema';
import { CreateLoadDto } from '../dto/create-load.dto';
import { UpdateLoadDto } from '../dto/update-load.dto';

@Injectable()
export class LoadService {
  constructor(
    @InjectModel(Load.name) private loadModel: Model<Load>,
  ) {}

  async findAll(): Promise<Load[]> {
    return this.loadModel.find().exec();
  }

  async findOne(id: string): Promise<Load> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid load ID format');
    }
    return this.loadModel.findById(id).exec();
  }

  async create(createLoadDto: CreateLoadDto): Promise<Load> {
    const createdLoad = new this.loadModel(createLoadDto);
    return createdLoad.save();
  }

  async update(id: string, updateLoadDto: UpdateLoadDto): Promise<Load> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid load ID format');
    }
    return this.loadModel
      .findByIdAndUpdate(id, updateLoadDto, { new: true })
      .exec();
  }

  async delete(id: string): Promise<Load> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid load ID format');
    }
    return this.loadModel.findByIdAndDelete(id).exec();
  }
}