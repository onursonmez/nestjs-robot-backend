import { Controller, Get, Post, Put, Delete, Body, Param, NotFoundException, BadRequestException } from '@nestjs/common';
import { LoadService } from '../services/load.service';
import { CreateLoadDto } from '../dto/create-load.dto';
import { UpdateLoadDto } from '../dto/update-load.dto';

@Controller('loads')
export class LoadController {
  constructor(private readonly loadService: LoadService) {}

  @Get()
  async findAll() {
    return this.loadService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const load = await this.loadService.findOne(id);
      if (!load) {
        throw new NotFoundException('Load not found');
      }
      return load;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new NotFoundException('Load not found');
    }
  }

  @Post()
  async create(@Body() createLoadDto: CreateLoadDto) {
    return this.loadService.create(createLoadDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateLoadDto: UpdateLoadDto) {
    try {
      const load = await this.loadService.update(id, updateLoadDto);
      if (!load) {
        throw new NotFoundException('Load not found');
      }
      return load;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new NotFoundException('Load not found');
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    try {
      const load = await this.loadService.delete(id);
      if (!load) {
        throw new NotFoundException('Load not found');
      }
      return load;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new NotFoundException('Load not found');
    }
  }
}