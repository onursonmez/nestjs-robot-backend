import { WebSocketGateway, SubscribeMessage, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { LoadService } from '../services/load.service';
import { CreateLoadDto } from '../dto/create-load.dto';
import { UpdateLoadDto } from '../dto/update-load.dto';
import { MqttService } from '../services/mqtt.service';
import { Load } from '../schemas/load.schema';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  transports: ['websocket']
})
export class LoadGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  private client: Socket;

  constructor(
    private readonly mqttService: MqttService,
    private readonly loadService: LoadService,
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

  @SubscribeMessage('findAllLoads')
  async handleFindAllLoads() {
    const loads = await this.loadService.findAll();
    return { event: 'allLoads', data: loads };
  }

  @SubscribeMessage('findOneLoad')
  async handleFindOne(client: Socket, id: string) {
    const load = await this.loadService.findOne(id);
    return { event: 'load', data: load };
  }

  @SubscribeMessage('loadCreate')
  async handleTypeCreate(client: Socket, createLoadDto: CreateLoadDto) {
    const load = await this.loadService.create(createLoadDto);
    this.notifyLoadCreated(load);
    return { event: 'loadCreated', data: load };
  }

  @SubscribeMessage('loadUpdate')
  async handleTypeUpdate(client: Socket, { id, updateLoadDto }: { id: string; updateLoadDto: UpdateLoadDto }) {
    const load = await this.loadService.update(id, updateLoadDto);
    this.notifyLoadUpdated(load);
    return { event: 'loadUpdated', data: load };
  }

  @SubscribeMessage('loadDelete')
  async handleTypeDelete(client: Socket, id: string) {
    const load = await this.loadService.delete(id);
    this.notifyLoadDeleted(id);
    return { event: 'loadDeleted', data: id };
  }

  notifyLoadCreated(load: Load) {
    // Socket.IO notification
    this.server.emit('loadCreated', load);
    
    // MQTT notification
    this.mqttService.publish('load/created', JSON.stringify(load));
  }

  notifyLoadUpdated(load: Load) {
    // Socket.IO notification
    this.server.emit('loadUpdated', load);
    
    // MQTT notification
    this.mqttService.publish('load/updated', JSON.stringify(load));
  }

  notifyLoadDeleted(id: string) {
    // Socket.IO notification
    this.server.emit('loadDeleted', id);
    
    // MQTT notification
    this.mqttService.publish('load/deleted', id);
  }
}

