import { Controller, Get, Post, Put, Delete, Body, Param, NotFoundException, BadRequestException } from '@nestjs/common';
import { CarrierTypeService } from '../services/carrier-type.service';
import { CreateCarrierTypeDto } from '../dto/create-carrier-type.dto';
import { UpdateCarrierTypeDto } from '../dto/update-carrier-type.dto';

@Controller('carrier-types')
export class CarrierTypeController {
  constructor(private readonly carrierTypeService: CarrierTypeService) {}

  @Get()
  async findAll() {
    return this.carrierTypeService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const carrierType = await this.carrierTypeService.findOne(id);
      if (!carrierType) {
        throw new NotFoundException('Robot type not found');
      }
      return carrierType;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new NotFoundException('Robot type not found');
    }
  }

  @Post()
  async create(@Body() createCarrierTypeDto: CreateCarrierTypeDto) {
    return this.carrierTypeService.create(createCarrierTypeDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateCarrierTypeDto: UpdateCarrierTypeDto) {
    try {
      const carrierType = await this.carrierTypeService.update(id, updateCarrierTypeDto);
      if (!carrierType) {
        throw new NotFoundException('Robot type not found');
      }
      return carrierType;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new NotFoundException('Robot type not found');
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    try {
      const carrierType = await this.carrierTypeService.delete(id);
      if (!carrierType) {
        throw new NotFoundException('Robot type not found');
      }
      return carrierType;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new NotFoundException('Robot type not found');
    }
  }
}