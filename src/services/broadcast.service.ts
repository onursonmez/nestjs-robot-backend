import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { RobotService } from './robot.service';
import { RobotGateway } from '../gateways/robot.gateway';

@Injectable()
export class BroadcastService implements OnModuleInit, OnModuleDestroy {
  private broadcastTimer: NodeJS.Timeout;

  constructor(
    private readonly robotService: RobotService,
    private readonly robotGateway: RobotGateway
  ) {}

  async onModuleInit() {
    // Wait a brief moment for all connections to be established
    this.broadcastTimer = setTimeout(async () => {
      await this.broadcastAllRobots();
    }, 1000);
  }

  onModuleDestroy() {
    if (this.broadcastTimer) {
      clearTimeout(this.broadcastTimer);
    }
  }

  private async broadcastAllRobots() {
    try {
      const robots = await this.robotService.findAll();
      this.robotGateway.broadcastAllRobots(robots);
      console.log('Initial robots data broadcasted to all clients');
    } catch (error) {
      console.error('Error broadcasting robots:', error);
    }
  }
}