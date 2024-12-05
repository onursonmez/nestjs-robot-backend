import { Controller, Get, Post, Put, Delete, Body, Param, NotFoundException, BadRequestException } from '@nestjs/common';
import { RobotTypeService } from '../services/robot-type.service';
import { CreateRobotTypeDto } from '../dto/create-robot-type.dto';
import { UpdateRobotTypeDto } from '../dto/update-robot-type.dto';

@Controller('robot-types')
export class RobotTypeController {
  constructor(private readonly robotTypeService: RobotTypeService) {}

  @Get()
  async findAll() {
    return this.robotTypeService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const robotType = await this.robotTypeService.findOne(id);
      if (!robotType) {
        throw new NotFoundException('Robot type not found');
      }
      return robotType;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new NotFoundException('Robot type not found');
    }
  }

  @Post()
  async create(@Body() createRobotTypeDto: CreateRobotTypeDto) {
    return this.robotTypeService.create(createRobotTypeDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateRobotTypeDto: UpdateRobotTypeDto) {
    try {
      const robotType = await this.robotTypeService.update(id, updateRobotTypeDto);
      if (!robotType) {
        throw new NotFoundException('Robot type not found');
      }
      return robotType;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new NotFoundException('Robot type not found');
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const robotType = await this.robotTypeService.remove(id);
      if (!robotType) {
        throw new NotFoundException('Robot type not found');
      }
      return robotType;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new NotFoundException('Robot type not found');
    }
  }
}