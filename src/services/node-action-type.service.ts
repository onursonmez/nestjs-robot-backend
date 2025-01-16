import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { NodeActionType } from '../schemas/node-action-type.schema';
import { CreateNodeActionTypeDto } from '../dto/create-node-action-type.dto';
import { UpdateNodeActionTypeDto } from '../dto/update-node-action-type.dto';

@Injectable()
export class NodeActionTypeService {
  constructor(
    @InjectModel(NodeActionType.name) private nodeActionModel: Model<NodeActionType>,
  ) {}

  async findAll(): Promise<NodeActionType[]> {
    return this.nodeActionModel.find().exec();
  }

  async findOne(id: string): Promise<NodeActionType> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid node action type ID format');
    }
    return this.nodeActionModel.findById(id).exec();
  }

  async create(createNodeActionTypeDto: CreateNodeActionTypeDto): Promise<NodeActionType> {
    const createdNodeActionType = new this.nodeActionModel(createNodeActionTypeDto);
    return createdNodeActionType.save();
  }

  async update(id: string, updateNodeActionTypeDto: UpdateNodeActionTypeDto): Promise<NodeActionType> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid node action type ID format');
    }
    return this.nodeActionModel
      .findByIdAndUpdate(id, updateNodeActionTypeDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<NodeActionType> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid node action type ID format');
    }
    return this.nodeActionModel.findByIdAndDelete(id).exec();
  }
}