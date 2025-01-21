import { WebSocketGateway, SubscribeMessage, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AreaService } from '../services/area.service';
import { CreateAreaDto } from '../dto/create-area.dto';
import { UpdateAreaDto } from '../dto/update-area.dto';
import { MqttService } from '../services/mqtt.service';
import { Area } from '../schemas/area.schema';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  transports: ['websocket']
})
export class AreaGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  private client: Socket;

  constructor(
    private readonly mqttService: MqttService,
    private readonly areaService: AreaService,
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

  @SubscribeMessage('findAllAreas')
  async handleFindAllAreas() {
    const areas = await this.areaService.findAll();
    return { event: 'allAreas', data: areas };
  }

  @SubscribeMessage('findOneArea')
  async handleFindOne(client: Socket, id: string) {
    const area = await this.areaService.findOne(id);
    return { event: 'area', data: area };
  }

  @SubscribeMessage('areaCreate')
  async handleTypeCreate(client: Socket, createAreaDto: CreateAreaDto) {
    const area = await this.areaService.create(createAreaDto);
    this.notifyAreaCreated(area);
    return { event: 'areaCreated', data: area };
  }

  @SubscribeMessage('areaUpdate')
  async handleTypeUpdate(client: Socket, { id, updateAreaDto }: { id: string; updateAreaDto: UpdateAreaDto }) {
    const area = await this.areaService.update(id, updateAreaDto);
    this.notifyAreaUpdated(area);
    return { event: 'areaUpdated', data: area };
  }

  @SubscribeMessage('areaDelete')
  async handleTypeDelete(client: Socket, id: string) {
    const area = await this.areaService.delete(id);
    this.notifyAreaDeleted(id);
    return { event: 'areaDeleted', data: id };
  }

  notifyAreaCreated(area: Area) {
    // Socket.IO notification
    this.server.emit('areaCreated', area);
    
    // MQTT notification
    this.mqttService.publish('area/created', JSON.stringify(area));
  }

  notifyAreaUpdated(area: Area) {
    // Socket.IO notification
    this.server.emit('areaUpdated', area);
    
    // MQTT notification
    this.mqttService.publish('area/updated', JSON.stringify(area));
  }

  notifyAreaDeleted(id: string) {
    // Socket.IO notification
    this.server.emit('areaDeleted', id);
    
    // MQTT notification
    this.mqttService.publish('area/deleted', id);
  }
}

