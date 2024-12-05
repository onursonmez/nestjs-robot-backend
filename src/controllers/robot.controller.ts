import { Controller, Get, Post, Put, Delete, Body, Param, NotFoundException } from '@nestjs/common';
import { RobotService } from '../services/robot.service';
import { CreateRobotDto } from '../dto/create-robot.dto';
import { UpdateRobotDto } from '../dto/update-robot.dto';
import { RobotGateway } from '../gateways/robot.gateway';

@Controller('robots')
export class RobotController {
  constructor(
    private readonly robotService: RobotService,
    private readonly robotGateway: RobotGateway,
  ) {}

  @Get()
  async findAll() {
    return this.robotService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const robot = await this.robotService.findOne(id);
    if (!robot) {
      throw new NotFoundException('Robot not found');
    }
    return robot;
  }

  @Post()
  async create(@Body() createRobotDto: CreateRobotDto) {
    const robot = await this.robotService.create(createRobotDto);
    this.robotGateway.notifyRobotCreated(robot);
    return robot;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateRobotDto: UpdateRobotDto) {
    const robot = await this.robotService.update(id, updateRobotDto);
    if (!robot) {
      throw new NotFoundException('Robot not found');
    }
    this.robotGateway.notifyRobotUpdated(robot);
    return robot;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const robot = await this.robotService.remove(id);
    if (!robot) {
      throw new NotFoundException('Robot not found');
    }
    this.robotGateway.notifyRobotDeleted(id);
    return robot;
  }
}