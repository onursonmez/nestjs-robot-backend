import { Controller, Get, Post, Put, Delete, Body, Param, NotFoundException } from '@nestjs/common';
import { MapService } from '../services/map.service';
import { CreateMapDto } from '../dto/create-map.dto';
import { UpdateMapDto } from '../dto/update-map.dto';
import { MapGateway } from '../gateways/map.gateway';

@Controller('maps')
export class MapController {
  constructor(
    private readonly mapService: MapService,
    private readonly mapGateway: MapGateway,
  ) {}

  @Get()
  async findAll() {
    return this.mapService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const map = await this.mapService.findOne(id);
    if (!map) {
      throw new NotFoundException('Map not found');
    }
    return map;
  }

  @Post()
  async create(@Body() createMapDto: CreateMapDto) {
    const map = await this.mapService.create(createMapDto);
    this.mapGateway.notifyMapCreated(map);
    return map;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateMapDto: UpdateMapDto) {
    const map = await this.mapService.update(id, updateMapDto);
    if (!map) {
      throw new NotFoundException('Map not found');
    }
    this.mapGateway.notifyMapUpdated(map);
    return map;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const map = await this.mapService.remove(id);
    if (!map) {
      throw new NotFoundException('Map not found');
    }
    this.mapGateway.notifyMapDeleted(id);
    return map;
  }
}