import { WebSocketGateway, SubscribeMessage, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RobotService } from '../services/robot.service';
import { CreateRobotDto } from '../dto/create-robot.dto';
import { UpdateRobotDto } from '../dto/update-robot.dto';
import { MqttService } from '../services/mqtt.service';
import { Robot } from '../schemas/robot.schema';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  transports: ['websocket']
})
export class RobotGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly robotService: RobotService,
    private readonly mqttService: MqttService
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
  async handleFindOne(client: Socket, id: string) {
    const robot = await this.robotService.findOne(id);
    return { event: 'robot', data: robot };
  }

  @SubscribeMessage('createRobot')
  async handleCreate(client: Socket, createRobotDto: CreateRobotDto) {
    const robot = await this.robotService.create(createRobotDto);
    this.notifyRobotCreated(robot);
    return { event: 'robotCreated', data: robot };
  }

  @SubscribeMessage('updateRobot')
  async handleUpdate(client: Socket, payload: { id: string; updateRobotDto: UpdateRobotDto }) {
    const robot = await this.robotService.update(payload.id, payload.updateRobotDto);
    this.notifyRobotUpdated(robot);
    return { event: 'robotUpdated', data: robot };
  }

  @SubscribeMessage('removeRobot')
  async handleRemove(client: Socket, id: string) {
    const robot = await this.robotService.remove(id);
    this.notifyRobotDeleted(id);
    return { event: 'robotDeleted', data: id };
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