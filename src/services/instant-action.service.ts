import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { InstantAction } from '../schemas/instant-action.schema';
import { CreateInstantActionDto } from '../dto/create-instant-action.dto';
import { UpdateInstantActionDto } from '../dto/update-instant-action.dto';

@Injectable()
export class InstantActionService {
  constructor(
    @InjectModel(InstantAction.name) private instantActionModel: Model<InstantAction>,
  ) {}

  async findAll(): Promise<InstantAction[]> {
    return this.instantActionModel.find().exec();
  }

  async findOne(id: string): Promise<InstantAction> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid instant action ID format');
    }
    return this.instantActionModel.findById(id).exec();
  }

  async create(createInstantActionDto: CreateInstantActionDto): Promise<InstantAction> {
    const createdInstantAction = new this.instantActionModel(createInstantActionDto);
    return createdInstantAction.save();
  }

  async update(id: string, updateInstantActionDto: UpdateInstantActionDto): Promise<InstantAction> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid instant action ID format');
    }
    return this.instantActionModel
      .findByIdAndUpdate(id, updateInstantActionDto, { new: true })
      .exec();
  }

  async delete(id: string): Promise<InstantAction> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid instant action ID format');
    }
    return this.instantActionModel.findByIdAndDelete(id).exec();
  }
}