import { WebSocketGateway, SubscribeMessage, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RobotService } from '../services/robot.service';
import { RobotTypeService } from '../services/robot-type.service';
import { CreateRobotDto } from '../dto/create-robot.dto';
import { UpdateRobotDto } from '../dto/update-robot.dto';
import { CreateRobotTypeDto } from '../dto/create-robot-type.dto';
import { UpdateRobotTypeDto } from '../dto/update-robot-type.dto';
import { MqttService } from '../services/mqtt.service';
import { Robot } from '../schemas/robot.schema';
import { RobotType } from '../schemas/robot-type.schema';

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
    private readonly robotTypeService: RobotTypeService,
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

  @SubscribeMessage('robotCreate')
  async handleCreate(client: Socket, createRobotDto: CreateRobotDto) {
    const robot = await this.robotService.create(createRobotDto);
    this.notifyRobotCreated(robot);
    return { event: 'robotCreated', data: robot };
  }

  @SubscribeMessage('robotUpdate')
  async handleUpdate(client: Socket, { id, updateRobotDto }: { id: string; updateRobotDto: UpdateRobotDto }) {
    const robot = await this.robotService.update(id, updateRobotDto);
    this.notifyRobotUpdated(robot);
    return { event: 'robotUpdated', data: robot };
  }

  @SubscribeMessage('robotRemove')
  async handleRemove(client: Socket, id: string) {
    const robot = await this.robotService.remove(id);
    this.notifyRobotDeleted(id);
    return { event: 'robotDeleted', data: id };
  }

  @SubscribeMessage('findAllRobotTypes')
  async handleFindAllRobotTypes() {
    const robotTypes = await this.robotTypeService.findAll();
    return { event: 'allRobotTypes', data: robotTypes };
  }

  @SubscribeMessage('robotTypeCreate')
  async handleTypeCreate(client: Socket, createRobotTypeDto: CreateRobotTypeDto) {
    const robotType = await this.robotTypeService.create(createRobotTypeDto);
    this.notifyRobotTypeCreated(robotType);
    return { event: 'robotCreated', data: robotType };
  }

  @SubscribeMessage('robotTypeUpdate')
  async handleTypeUpdate(client: Socket, { id, updateRobotTypeDto }: { id: string; updateRobotTypeDto: UpdateRobotTypeDto }) {
    const robotType = await this.robotTypeService.update(id, updateRobotTypeDto);
    this.notifyRobotTypeUpdated(robotType);
    return { event: 'robotUpdated', data: robotType };
  }

  @SubscribeMessage('robotTypeRemove')
  async handleTypeRemove(client: Socket, id: string) {
    console.log(id);
    const robotType = await this.robotTypeService.remove(id);
    this.notifyRobotTypeDeleted(id);
    return { event: 'robotTypeDeleted', data: id };
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


  notifyRobotTypeCreated(robotType: RobotType) {
    // Socket.IO notification
    this.server.emit('robotTypeCreated', robotType);
    
    // MQTT notification
    this.mqttService.publish('robot-types/created', JSON.stringify(robotType));
  }

  notifyRobotTypeUpdated(robotType: RobotType) {
    // Socket.IO notification
    this.server.emit('robotTypeUpdated', robotType);
    
    // MQTT notification
    this.mqttService.publish('robots-types/updated', JSON.stringify(robotType));
  }

  notifyRobotTypeDeleted(id: string) {
    // Socket.IO notification
    this.server.emit('robotTypeDeleted', id);
    
    // MQTT notification
    this.mqttService.publish('robots-types/deleted', id);
  }

  broadcastAllRobots(robots: Robot[]) {
    // Socket.IO broadcast
    this.server.emit('allRobots', robots);
    
    // MQTT broadcast
    this.mqttService.publish('robots/all', JSON.stringify(robots));
  }
}

