import { WebSocketGateway, SubscribeMessage, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CarrierTypeService } from '../services/carrier-type.service';
import { CreateCarrierTypeDto } from '../dto/create-carrier-type.dto';
import { UpdateCarrierTypeDto } from '../dto/update-carrier-type.dto';
import { MqttService } from '../services/mqtt.service';
import { CarrierType } from '../schemas/carrier-type.schema';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  transports: ['websocket']
})
export class CarrierTypeGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  private client: Socket;

  constructor(
    private readonly mqttService: MqttService,
    private readonly carrierTypeService: CarrierTypeService,
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

  @SubscribeMessage('findAllCarrierTypes')
  async handleFindAllCarrierTypes() {
    const carrierTypes = await this.carrierTypeService.findAll();
    return { event: 'allCarrierTypes', data: carrierTypes };
  }

  @SubscribeMessage('findOneRobot')
  async handleFindOne(client: Socket, id: string) {
    const carrierType = await this.carrierTypeService.findOne(id);
    return { event: 'carrierType', data: carrierType };
  }

  @SubscribeMessage('carrierTypeCreate')
  async handleTypeCreate(client: Socket, createCarrierTypeDto: CreateCarrierTypeDto) {
    const carrierType = await this.carrierTypeService.create(createCarrierTypeDto);
    this.notifyCarrierTypeCreated(carrierType);
    return { event: 'carrierTypeCreated', data: carrierType };
  }

  @SubscribeMessage('carrierTypeUpdate')
  async handleTypeUpdate(client: Socket, { id, updateCarrierTypeDto }: { id: string; updateCarrierTypeDto: UpdateCarrierTypeDto }) {
    const carrierType = await this.carrierTypeService.update(id, updateCarrierTypeDto);
    this.notifyCarrierTypeUpdated(carrierType);
    return { event: 'carrierTypeUpdated', data: carrierType };
  }

  @SubscribeMessage('carrierTypeDelete')
  async handleTypeDelete(client: Socket, id: string) {
    const carrierType = await this.carrierTypeService.delete(id);
    this.notifyCarrierTypeDeleted(id);
    return { event: 'carrierTypeDeleted', data: id };
  }

  notifyCarrierTypeCreated(carrierType: CarrierType) {
    // Socket.IO notification
    this.server.emit('carrierTypeCreated', carrierType);
    
    // MQTT notification
    this.mqttService.publish('carrier-type/created', JSON.stringify(carrierType));
  }

  notifyCarrierTypeUpdated(carrierType: CarrierType) {
    // Socket.IO notification
    this.server.emit('carrierTypeUpdated', carrierType);
    
    // MQTT notification
    this.mqttService.publish('robots-type/updated', JSON.stringify(carrierType));
  }

  notifyCarrierTypeDeleted(id: string) {
    // Socket.IO notification
    this.server.emit('carrierTypeDeleted', id);
    
    // MQTT notification
    this.mqttService.publish('robots-type/deleted', id);
  }
}

