import { Injectable, OnModuleInit } from '@nestjs/common';
import { RobotService } from './robot.service';
import { RobotGateway } from '../gateways/robot.gateway';

@Injectable()
export class BroadcastService implements OnModuleInit {
  constructor(
    private readonly robotService: RobotService,
    private readonly robotGateway: RobotGateway
  ) {}

  async onModuleInit() {
    // Wait a brief moment for all connections to be established
    setTimeout(async () => {
      await this.broadcastAllRobots();
    }, 1000);
  }

  private async broadcastAllRobots() {
    const robots = await this.robotService.findAll();
    this.robotGateway.broadcastAllRobots(robots);
    console.log('Initial robots data broadcasted to all clients');
  }
}