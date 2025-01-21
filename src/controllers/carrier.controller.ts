import { Controller, Get, Post, Put, Delete, Body, Param, NotFoundException, BadRequestException } from '@nestjs/common';
import { CarrierService } from '../services/carrier.service';
import { CreateCarrierDto } from '../dto/create-carrier.dto';
import { UpdateCarrierDto } from '../dto/update-carrier.dto';

@Controller('carriers')
export class CarrierController {
  constructor(private readonly carrierService: CarrierService) {}

  @Get()
  async findAll() {
    return this.carrierService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const carrier = await this.carrierService.findOne(id);
      if (!carrier) {
        throw new NotFoundException('Carrier not found');
      }
      return carrier;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new NotFoundException('Carrier not found');
    }
  }

  @Post()
  async create(@Body() createCarrierDto: CreateCarrierDto) {
    return this.carrierService.create(createCarrierDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateCarrierDto: UpdateCarrierDto) {
    try {
      const carrier = await this.carrierService.update(id, updateCarrierDto);
      if (!carrier) {
        throw new NotFoundException('Carrier not found');
      }
      return carrier;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new NotFoundException('Carrier not found');
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    try {
      const carrier = await this.carrierService.delete(id);
      if (!carrier) {
        throw new NotFoundException('Carrier not found');
      }
      return carrier;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new NotFoundException('Carrier not found');
    }
  }
}