import { Controller, Get, Post, Put, Delete, Body, Param, NotFoundException, BadRequestException } from '@nestjs/common';
import { InstantActionService } from '../services/instant-action.service';
import { CreateInstantActionDto } from '../dto/create-instant-action.dto';
import { UpdateInstantActionDto } from '../dto/update-instant-action.dto';

@Controller('instant-actions')
export class InstantActionController {
  constructor(private readonly instantActionService: InstantActionService) {}

  @Get()
  async findAll() {
    return this.instantActionService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const instantAction = await this.instantActionService.findOne(id);
      if (!instantAction) {
        throw new NotFoundException('Instant action not found');
      }
      return instantAction;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new NotFoundException('Instant action not found');
    }
  }

  @Post()
  async create(@Body() createInstantActionDto: CreateInstantActionDto) {
    return this.instantActionService.create(createInstantActionDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateInstantActionDto: UpdateInstantActionDto) {
    try {
      const instantAction = await this.instantActionService.update(id, updateInstantActionDto);
      if (!instantAction) {
        throw new NotFoundException('Instant action not found');
      }
      return instantAction;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new NotFoundException('Instant action not found');
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    try {
      const instantAction = await this.instantActionService.delete(id);
      if (!instantAction) {
        throw new NotFoundException('Instant action not found');
      }
      return instantAction;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new NotFoundException('Instant action not found');
    }
  }
}