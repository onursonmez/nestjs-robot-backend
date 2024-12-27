import { Controller, Get, Post, Put, Delete, Body, Param, NotFoundException } from '@nestjs/common';
import { GraphService } from '../services/graph.service';
import { CreateGraphDto } from '../dto/create-graph.dto';
import { UpdateGraphDto } from '../dto/update-graph.dto';
import { GraphGateway } from '../gateways/graph.gateway';

@Controller('graphs')
export class GraphController {
  constructor(
    private readonly graphService: GraphService,
    private readonly graphGateway: GraphGateway,
  ) {}

  @Get()
  async findAll() {
    return this.graphService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const graph = await this.graphService.findOne(id);
    if (!graph) {
      throw new NotFoundException('Graph not found');
    }
    return graph;
  }

  @Post()
  async create(@Body() createGraphDto: CreateGraphDto) {
    const graph = await this.graphService.create(createGraphDto);
    this.graphGateway.notifyGraphCreated(graph);
    return graph;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateGraphDto: UpdateGraphDto) {
    const graph = await this.graphService.update(id, updateGraphDto);
    if (!graph) {
      throw new NotFoundException('Graph not found');
    }
    this.graphGateway.notifyGraphUpdated(graph);
    return graph;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const graph = await this.graphService.remove(id);
    if (!graph) {
      throw new NotFoundException('Graph not found');
    }
    this.graphGateway.notifyGraphDeleted(id);
    return graph;
  }
}