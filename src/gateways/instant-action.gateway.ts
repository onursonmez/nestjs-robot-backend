import { WebSocketGateway, SubscribeMessage, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { InstantActionService } from '../services/instant-action.service';
import { CreateInstantActionDto } from '../dto/create-instant-action.dto';
import { UpdateInstantActionDto } from '../dto/update-instant-action.dto';
import { MqttService } from '../services/mqtt.service';
import { InstantAction } from '../schemas/instant-action.schema';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  transports: ['websocket']
})
export class InstantActionGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  private client: Socket;

  constructor(
    private readonly mqttService: MqttService,
    private readonly instantActionService: InstantActionService,
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

  @SubscribeMessage('findAllInstantActions')
  async handleFindAllInstantActions() {
    const instantActions = await this.instantActionService.findAll();
    return { event: 'allInstantActions', data: instantActions };
  }

  @SubscribeMessage('findOneRobot')
  async handleFindOne(client: Socket, id: string) {
    const instantAction = await this.instantActionService.findOne(id);
    return { event: 'instantAction', data: instantAction };
  }

  @SubscribeMessage('instantActionCreate')
  async handleTypeCreate(client: Socket, createInstantActionDto: CreateInstantActionDto) {
    const instantAction = await this.instantActionService.create(createInstantActionDto);
    this.notifyInstantActionCreated(instantAction);
    return { event: 'instantActionCreated', data: instantAction };
  }

  @SubscribeMessage('instantActionUpdate')
  async handleTypeUpdate(client: Socket, { id, updateInstantActionDto }: { id: string; updateInstantActionDto: UpdateInstantActionDto }) {
    const instantAction = await this.instantActionService.update(id, updateInstantActionDto);
    this.notifyInstantActionUpdated(instantAction);
    return { event: 'instantActionUpdated', data: instantAction };
  }

  @SubscribeMessage('instantActionDelete')
  async handleTypeDelete(client: Socket, id: string) {
    const instantAction = await this.instantActionService.delete(id);
    this.notifyInstantActionDeleted(id);
    return { event: 'instantActionDeleted', data: id };
  }

  notifyInstantActionCreated(instantAction: InstantAction) {
    // Socket.IO notification
    this.server.emit('instantActionCreated', instantAction);
    
    // MQTT notification
    this.mqttService.publish('instant-action/created', JSON.stringify(instantAction));
  }

  notifyInstantActionUpdated(instantAction: InstantAction) {
    // Socket.IO notification
    this.server.emit('instantActionUpdated', instantAction);
    
    // MQTT notification
    this.mqttService.publish('robots-type/updated', JSON.stringify(instantAction));
  }

  notifyInstantActionDeleted(id: string) {
    // Socket.IO notification
    this.server.emit('instantActionDeleted', id);
    
    // MQTT notification
    this.mqttService.publish('robots-type/deleted', id);
  }
}

