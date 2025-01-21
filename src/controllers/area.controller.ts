import { Controller, Get, Post, Put, Delete, Body, Param, NotFoundException, BadRequestException } from '@nestjs/common';
import { AreaService } from '../services/area.service';
import { CreateAreaDto } from '../dto/create-area.dto';
import { UpdateAreaDto } from '../dto/update-area.dto';

@Controller('areas')
export class AreaController {
  constructor(private readonly areaService: AreaService) {}

  @Get()
  async findAll() {
    return this.areaService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const area = await this.areaService.findOne(id);
      if (!area) {
        throw new NotFoundException('Area not found');
      }
      return area;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new NotFoundException('Area not found');
    }
  }

  @Post()
  async create(@Body() createAreaDto: CreateAreaDto) {
    return this.areaService.create(createAreaDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateAreaDto: UpdateAreaDto) {
    try {
      const area = await this.areaService.update(id, updateAreaDto);
      if (!area) {
        throw new NotFoundException('Area not found');
      }
      return area;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new NotFoundException('Area not found');
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    try {
      const area = await this.areaService.delete(id);
      if (!area) {
        throw new NotFoundException('Area not found');
      }
      return area;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new NotFoundException('Area not found');
    }
  }
}