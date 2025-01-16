import { Controller, Get, Post, Put, Delete, Body, Param, NotFoundException, BadRequestException } from '@nestjs/common';
import { NodeActionTypeService } from '../services/node-action-type.service';
import { CreateNodeActionTypeDto } from '../dto/create-node-action-type.dto';
import { UpdateNodeActionTypeDto } from '../dto/update-node-action-type.dto';

@Controller('node-action-types')
export class NodeActionTypeController {
  constructor(private readonly nodeActionTypeService: NodeActionTypeService) {}

  @Get()
  async findAll() {
    return this.nodeActionTypeService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const nodeActionType = await this.nodeActionTypeService.findOne(id);
      if (!nodeActionType) {
        throw new NotFoundException('Node action type not found');
      }
      return nodeActionType;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new NotFoundException('Node action type not found');
    }
  }

  @Post()
  async create(@Body() createNodeActionTypeDto: CreateNodeActionTypeDto) {
    return this.nodeActionTypeService.create(createNodeActionTypeDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateNodeActionTypeDto: UpdateNodeActionTypeDto) {
    try {
      const nodeActionType = await this.nodeActionTypeService.update(id, updateNodeActionTypeDto);
      if (!nodeActionType) {
        throw new NotFoundException('Node action type not found');
      }
      return nodeActionType;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new NotFoundException('Node action type not found');
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const nodeActionType = await this.nodeActionTypeService.remove(id);
      if (!nodeActionType) {
        throw new NotFoundException('Robot type not found');
      }
      return nodeActionType;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new NotFoundException('Robot type not found');
    }
  }
}