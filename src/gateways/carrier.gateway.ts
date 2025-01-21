import { WebSocketGateway, SubscribeMessage, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CarrierService } from '../services/carrier.service';
import { CreateCarrierDto } from '../dto/create-carrier.dto';
import { UpdateCarrierDto } from '../dto/update-carrier.dto';
import { MqttService } from '../services/mqtt.service';
import { Carrier } from '../schemas/carrier.schema';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  transports: ['websocket']
})
export class CarrierGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  private client: Socket;

  constructor(
    private readonly mqttService: MqttService,
    private readonly carrierService: CarrierService,
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

  @SubscribeMessage('findAllCarriers')
  async handleFindAllCarriers() {
    const carriers = await this.carrierService.findAll();
    return { event: 'allCarriers', data: carriers };
  }

  @SubscribeMessage('findOneCarrier')
  async handleFindOne(client: Socket, id: string) {
    const carrier = await this.carrierService.findOne(id);
    return { event: 'carrier', data: carrier };
  }

  @SubscribeMessage('carrierCreate')
  async handleTypeCreate(client: Socket, createCarrierDto: CreateCarrierDto) {
    const carrier = await this.carrierService.create(createCarrierDto);
    this.notifyCarrierCreated(carrier);
    return { event: 'carrierCreated', data: carrier };
  }

  @SubscribeMessage('carrierUpdate')
  async handleTypeUpdate(client: Socket, { id, updateCarrierDto }: { id: string; updateCarrierDto: UpdateCarrierDto }) {
    const carrier = await this.carrierService.update(id, updateCarrierDto);
    this.notifyCarrierUpdated(carrier);
    return { event: 'carrierUpdated', data: carrier };
  }

  @SubscribeMessage('carrierDelete')
  async handleTypeDelete(client: Socket, id: string) {
    const carrier = await this.carrierService.delete(id);
    this.notifyCarrierDeleted(id);
    return { event: 'carrierDeleted', data: id };
  }

  notifyCarrierCreated(carrier: Carrier) {
    // Socket.IO notification
    this.server.emit('carrierCreated', carrier);
    
    // MQTT notification
    this.mqttService.publish('carrier/created', JSON.stringify(carrier));
  }

  notifyCarrierUpdated(carrier: Carrier) {
    // Socket.IO notification
    this.server.emit('carrierUpdated', carrier);
    
    // MQTT notification
    this.mqttService.publish('carrier/updated', JSON.stringify(carrier));
  }

  notifyCarrierDeleted(id: string) {
    // Socket.IO notification
    this.server.emit('carrierDeleted', id);
    
    // MQTT notification
    this.mqttService.publish('carrier/deleted', id);
  }
}

