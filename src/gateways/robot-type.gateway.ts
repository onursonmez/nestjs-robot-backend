import { WebSocketGateway, SubscribeMessage, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RobotTypeService } from '../services/robot-type.service';
import { CreateRobotTypeDto } from '../dto/create-robot-type.dto';
import { UpdateRobotTypeDto } from '../dto/update-robot-type.dto';
import { MqttService } from '../services/mqtt.service';
import { RobotType } from '../schemas/robot-type.schema';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  transports: ['websocket']
})
export class RobotTypeGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  private client: Socket;

  constructor(
    private readonly mqttService: MqttService,
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

  @SubscribeMessage('findAllRobotTypes')
  async handleFindAllRobotTypes() {
    const robotTypes = await this.robotTypeService.findAll();
    return { event: 'allRobotTypes', data: robotTypes };
  }

  @SubscribeMessage('findOneRobot')
  async handleFindOne(client: Socket, id: string) {
    const robotType = await this.robotTypeService.findOne(id);
    return { event: 'robotType', data: robotType };
  }

  @SubscribeMessage('robotTypeCreate')
  async handleTypeCreate(client: Socket, createRobotTypeDto: CreateRobotTypeDto) {
    const robotType = await this.robotTypeService.create(createRobotTypeDto);
    this.notifyRobotTypeCreated(robotType);
    return { event: 'robotTypeCreated', data: robotType };
  }

  @SubscribeMessage('robotTypeUpdate')
  async handleTypeUpdate(client: Socket, { id, updateRobotTypeDto }: { id: string; updateRobotTypeDto: UpdateRobotTypeDto }) {
    const robotType = await this.robotTypeService.update(id, updateRobotTypeDto);
    this.notifyRobotTypeUpdated(robotType);
    return { event: 'robotTypeUpdated', data: robotType };
  }

  @SubscribeMessage('robotTypeDelete')
  async handleTypeDelete(client: Socket, id: string) {
    const robotType = await this.robotTypeService.delete(id);
    this.notifyRobotTypeDeleted(id);
    return { event: 'robotTypeDeleted', data: id };
  }

  notifyRobotTypeCreated(robotType: RobotType) {
    // Socket.IO notification
    this.server.emit('robotTypeCreated', robotType);
    
    // MQTT notification
    this.mqttService.publish('robot-type/created', JSON.stringify(robotType));
  }

  notifyRobotTypeUpdated(robotType: RobotType) {
    // Socket.IO notification
    this.server.emit('robotTypeUpdated', robotType);
    
    // MQTT notification
    this.mqttService.publish('robots-type/updated', JSON.stringify(robotType));
  }

  notifyRobotTypeDeleted(id: string) {
    // Socket.IO notification
    this.server.emit('robotTypeDeleted', id);
    
    // MQTT notification
    this.mqttService.publish('robots-type/deleted', id);
  }
}

