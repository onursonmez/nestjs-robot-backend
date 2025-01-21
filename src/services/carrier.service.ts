import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Carrier } from '../schemas/carrier.schema';
import { CreateCarrierDto } from '../dto/create-carrier.dto';
import { UpdateCarrierDto } from '../dto/update-carrier.dto';

@Injectable()
export class CarrierService {
  constructor(
    @InjectModel(Carrier.name) private carrierModel: Model<Carrier>,
  ) {}

  async findAll(): Promise<Carrier[]> {
    return this.carrierModel.find().exec();
  }

  async findOne(id: string): Promise<Carrier> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid carrier ID format');
    }
    return this.carrierModel.findById(id).exec();
  }

  async create(createCarrierDto: CreateCarrierDto): Promise<Carrier> {
    const createdCarrier = new this.carrierModel(createCarrierDto);
    return createdCarrier.save();
  }

  async update(id: string, updateCarrierDto: UpdateCarrierDto): Promise<Carrier> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid carrier ID format');
    }
    return this.carrierModel
      .findByIdAndUpdate(id, updateCarrierDto, { new: true })
      .exec();
  }

  async delete(id: string): Promise<Carrier> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid carrier ID format');
    }
    return this.carrierModel.findByIdAndDelete(id).exec();
  }
}