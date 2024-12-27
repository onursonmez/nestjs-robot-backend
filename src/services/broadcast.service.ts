import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { RobotService } from './robot.service';
import { MapService } from './map.service';
import { GraphService } from './graph.service';
import { RobotGateway } from '../gateways/robot.gateway';
import { MapGateway } from '../gateways/map.gateway';
import { GraphGateway } from '../gateways/graph.gateway';

@Injectable()
export class BroadcastService implements OnModuleInit, OnModuleDestroy {
  private broadcastTimer: NodeJS.Timeout;

  constructor(
    private readonly robotService: RobotService,
    private readonly mapService: MapService,
    private readonly graphService: GraphService,
    private readonly robotGateway: RobotGateway,
    private readonly mapGateway: MapGateway,
    private readonly graphGateway: GraphGateway,
  ) {}

  async onModuleInit() {
    // Wait a brief moment for all connections to be established
    this.broadcastTimer = setTimeout(async () => {
      await this.broadcastAllRobots();
      await this.broadcastAllMaps();
      await this.broadcastAllGraphs();
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

  private async broadcastAllMaps() {
    try {
      const maps = await this.mapService.findAll();
      this.mapGateway.broadcastAllMaps(maps);
      console.log('Initial maps data broadcasted to all clients');
    } catch (error) {
      console.error('Error broadcasting maps:', error);
    }
  }


  private async broadcastAllGraphs() {
    try {
      const graphs = await this.graphService.findAll();
      this.graphGateway.broadcastAllGraphs(graphs);
      console.log('Initial graphs graphs broadcasted to all clients');
    } catch (error) {
      console.error('Error broadcasting graphs:', error);
    }
  }
}