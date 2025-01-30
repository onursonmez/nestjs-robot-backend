import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { CarrierType } from '../schemas/carrier-type.schema';
import { CreateCarrierTypeDto } from '../dto/create-carrier-type.dto';
import { UpdateCarrierTypeDto } from '../dto/update-carrier-type.dto';

@Injectable()
export class CarrierTypeService {
  constructor(
    @InjectModel(CarrierType.name) private carrierTypeModel: Model<CarrierType>,
  ) {}

  async findAll(): Promise<CarrierType[]> {
    return this.carrierTypeModel.find().exec();
  }

  async findOne(id: string): Promise<CarrierType> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid carrier type ID format');
    }
    return this.carrierTypeModel.findById(id).exec();
  }

  async create(createCarrierTypeDto: CreateCarrierTypeDto): Promise<CarrierType> {
    const createdCarrierType = new this.carrierTypeModel(createCarrierTypeDto);
    return createdCarrierType.save();
  }

  async update(id: string, updateCarrierTypeDto: UpdateCarrierTypeDto): Promise<CarrierType> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid carrier type ID format');
    }
    return this.carrierTypeModel
      .findByIdAndUpdate(id, updateCarrierTypeDto, { new: true })
      .exec();
  }

  async delete(id: string): Promise<CarrierType> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid carrier type ID format');
    }
    return this.carrierTypeModel.findByIdAndDelete(id).exec();
  }
}