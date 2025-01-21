import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Area } from '../schemas/area.schema';
import { CreateAreaDto } from '../dto/create-area.dto';
import { UpdateAreaDto } from '../dto/update-area.dto';

@Injectable()
export class AreaService {
  constructor(
    @InjectModel(Area.name) private areaModel: Model<Area>,
  ) {}

  async findAll(): Promise<Area[]> {
    return this.areaModel.find().exec();
  }

  async findOne(id: string): Promise<Area> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid area ID format');
    }
    return this.areaModel.findById(id).exec();
  }

  async create(createAreaDto: CreateAreaDto): Promise<Area> {
    const createdArea = new this.areaModel(createAreaDto);
    return createdArea.save();
  }

  async update(id: string, updateAreaDto: UpdateAreaDto): Promise<Area> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid area ID format');
    }
    return this.areaModel
      .findByIdAndUpdate(id, updateAreaDto, { new: true })
      .exec();
  }

  async delete(id: string): Promise<Area> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid area ID format');
    }
    return this.areaModel.findByIdAndDelete(id).exec();
  }
}