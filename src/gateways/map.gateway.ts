import { WebSocketGateway, SubscribeMessage, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MapService } from '../services/map.service';
import { CreateMapDto } from '../dto/create-map.dto';
import { UpdateMapDto } from '../dto/update-map.dto';
import { MqttService } from '../services/mqtt.service';
import { Map } from '../schemas/map.schema';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  transports: ['websocket']
})
export class MapGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  private client: Socket;

  constructor(
    private readonly mqttService: MqttService,
    private readonly mapService: MapService,
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

  @SubscribeMessage('findAllMaps')
  async handleFindAll() {
    const maps = await this.mapService.findAll();
    return { event: 'allMaps', data: maps };
  }

  @SubscribeMessage('findOneMap')
  async handleFindOne(id: string) {
    const map = await this.mapService.findOne(id);
    return { event: 'map', data: map };
  }

  @SubscribeMessage('mapCreate')
  async handleCreate(client: Socket, createMapDto: CreateMapDto) {
    const map = await this.mapService.create(createMapDto);
    this.notifyMapCreated(map);
    return { event: 'mapCreated', data: map };
  }

  @SubscribeMessage('mapUpdate')
  async handleUpdate(client: Socket, { id, updateMapDto }: { id: string; updateMapDto: UpdateMapDto }) { 
    const map = await this.mapService.update(id, updateMapDto);
    this.notifyMapUpdated(map);
    return { event: 'mapUpdated', data: map };
  }

  @SubscribeMessage('mapDelete')
  async handleDelete(client: Socket, id: string) {
    const map = await this.mapService.delete(id);
    this.notifyMapDeleted(id);
    return { event: 'mapDeleted', data: id };
  }

  notifyMapCreated(map: Map) {
    // Socket.IO notification
    this.server.emit('mapCreated', map);
    
    // MQTT notification
    this.mqttService.publish('maps/created', JSON.stringify(map));
  }

  notifyMapUpdated(map: Map) {
    // Socket.IO notification
    this.server.emit('mapUpdated', map);
    
    // MQTT notification
    this.mqttService.publish('maps/updated', JSON.stringify(map));
  }

  notifyMapDeleted(id: string) {
    // Socket.IO notification
    this.server.emit('mapDeleted', id);
    
    // MQTT notification
    this.mqttService.publish('maps/deleted', id);
  }

  broadcastAllMaps(maps: Map[]) {
    // Socket.IO broadcast
    this.server.emit('allMaps', maps);
    
    // MQTT broadcast
    this.mqttService.publish('maps/all', JSON.stringify(maps));
  }
}

