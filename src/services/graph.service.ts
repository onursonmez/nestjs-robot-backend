import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Graph } from '../schemas/graph.schema';
import { CreateGraphDto } from '../dto/create-graph.dto';
import { UpdateGraphDto } from '../dto/update-graph.dto';

@Injectable()
export class GraphService {
  constructor(
    @InjectModel(Graph.name) private graphModel: Model<Graph>
  ) {}

  async findAll(): Promise<Graph[]> {
    return this.graphModel
      .find()
      .exec();
  }

  async findOne(id: string): Promise<Graph | null> {
    return this.graphModel
      .findById(id)
      .exec();
  }

  async create(createGraphDto: CreateGraphDto): Promise<Graph> {
    const createdGraph = new this.graphModel(createGraphDto);
    return createdGraph.save();
  }

  async update(id: string, updateGraphDto: UpdateGraphDto): Promise<Graph | null> {
    return this.graphModel
      .findByIdAndUpdate(id, updateGraphDto, { new: true })
      .exec();
  }

  async delete(id: string): Promise<Graph | null> {
    return this.graphModel.findByIdAndDelete(id).exec();
  }
}