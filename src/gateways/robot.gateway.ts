import { WebSocketGateway, SubscribeMessage, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RobotService } from '../services/robot.service';
import { CreateRobotDto } from '../dto/create-robot.dto';
import { UpdateRobotDto } from '../dto/update-robot.dto';
import { MqttService } from '../services/mqtt.service';
import { Robot } from '../schemas/robot.schema';
import { Inject, forwardRef } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  transports: ['websocket']
})
export class RobotGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  private client: Socket;

  constructor(
    private readonly mqttService: MqttService,
    private readonly robotService: RobotService,
  ) {}

  afterInit(server: Server) {
    console.log('WebSocket Gateway initialized');
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('findAllRobots')
  async handleFindAll() {
    const robots = await this.robotService.findAll();
    return { event: 'allRobots', data: robots };
  }

  @SubscribeMessage('findOneRobot')
  async handleFindOne(id: string) {
    const robot = await this.robotService.findOne(id);
    return { event: 'robot', data: robot };
  }

  @SubscribeMessage('createRobot')
  async handleCreate(createRobotDto: CreateRobotDto) {
    const robot = await this.robotService.create(createRobotDto);
    this.notifyRobotCreated(robot);
    return { event: 'robotCreated', data: robot };
  }

  @SubscribeMessage('updateRobot')
  async handleUpdate(payload: { id: string; updateRobotDto: UpdateRobotDto }) {
    const robot = await this.robotService.update(payload.id, payload.updateRobotDto);
    this.notifyRobotUpdated(robot);
    return { event: 'robotUpdated', data: robot };
  }

  @SubscribeMessage('removeRobot')
  async handleRemove(id: string) {
    const robot = await this.robotService.remove(id);
    this.notifyRobotDeleted(id);
    return { event: 'robotDeleted', data: id };
  }

  @SubscribeMessage('robots/publish')
  async handlePublish(robots: Robot[]) {
    const missmatchedRobots = await this.robotService.compareRobotsFromDB(robots);
    console.log("missmatchedRobots", missmatchedRobots);
    if (missmatchedRobots) {
      for(const robot of missmatchedRobots) {
        this.notifyRobotCreated(robot);
      }
    }
    return { event: 'comparedRobots', data: robots };
  }

  notifyRobotCreated(robot: Robot) {
    // Socket.IO notification
    this.server.emit('robotCreated', robot);

    this.handleFindAll();
    
    // MQTT notification
    this.mqttService.publish('robots/created', JSON.stringify(robot));
  }

  notifyRobotUpdated(robot: Robot) {
    // Socket.IO notification
    this.server.emit('robotUpdated', robot);
    
    // MQTT notification
    this.mqttService.publish('robots/updated', JSON.stringify(robot));
  }

  notifyRobotDeleted(id: string) {
    // Socket.IO notification
    this.server.emit('robotDeleted', id);
    
    // MQTT notification
    this.mqttService.publish('robots/deleted', id);
  }

  broadcastAllRobots(robots: Robot[]) {
    // Socket.IO broadcast
    this.server.emit('allRobots', robots);
    
    // MQTT broadcast
    this.mqttService.publish('robots/all', JSON.stringify(robots));
  }
}

