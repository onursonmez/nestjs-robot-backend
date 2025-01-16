import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Map } from '../schemas/map.schema';
import { CreateMapDto } from '../dto/create-map.dto';
import { UpdateMapDto } from '../dto/update-map.dto';

@Injectable()
export class MapService {
  constructor(
    @InjectModel(Map.name) private mapModel: Model<Map>
  ) { }

  async findAll(): Promise<Map[]> {
    return this.mapModel
      .find()
      .select('-rosMsg.data')
      .exec();
  }

  async findOne(id: string): Promise<Map | null> {
    return this.mapModel
      .findById(id)
      .select('-rosMsg.data')
      .exec();
  }

  async create(createMapDto: CreateMapDto): Promise<Map> {
    const createdMap = new this.mapModel(createMapDto);
    return createdMap.save();
  }

  async update(id: string, updateMapDto: UpdateMapDto): Promise<Map | null> {
    return this.mapModel
      .findByIdAndUpdate(id, updateMapDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Map | null> {
    return this.mapModel.findByIdAndDelete(id).exec();
  }
}