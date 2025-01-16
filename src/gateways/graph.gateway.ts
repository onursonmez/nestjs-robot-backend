import { WebSocketGateway, SubscribeMessage, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GraphService } from '../services/graph.service';
import { CreateGraphDto } from '../dto/create-graph.dto';
import { UpdateGraphDto } from '../dto/update-graph.dto';
import { MqttService } from '../services/mqtt.service';
import { Graph } from '../schemas/graph.schema';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  transports: ['websocket']
})
export class GraphGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  private client: Socket;

  constructor(
    private readonly mqttService: MqttService,
    private readonly graphService: GraphService,
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

  @SubscribeMessage('findAllGraphs')
  async handleFindAll() {
    const graphs = await this.graphService.findAll();
    return { event: 'allGraphs', data: graphs };
  }

  @SubscribeMessage('findOneGraph')
  async handleFindOne(id: string) {
    const graph = await this.graphService.findOne(id);
    return { event: 'graph', data: graph };
  }

  @SubscribeMessage('graphCreate')
  async handleCreate(client: Socket, createGraphDto: CreateGraphDto) {
    const graph = await this.graphService.create(createGraphDto);
    this.notifyGraphCreated(graph);
    return { event: 'graphCreated', data: graph };
  }

  @SubscribeMessage('graphUpdate')
  async handleUpdate(client: Socket, {id, updateGraphDto}: { id: string; updateGraphDto: UpdateGraphDto }) {
    const graph = await this.graphService.update(id, updateGraphDto);
    this.notifyGraphUpdated(graph);
    return { event: 'graphUpdated', data: graph };
  }

  @SubscribeMessage('graphRemove')
  async handleRemove(client: Socket, id: string) {
    const graph = await this.graphService.remove(id);
    this.notifyGraphDeleted(id);
    return { event: 'graphDeleted', data: id };
  }

  notifyGraphCreated(graph: Graph) {
    // Socket.IO notification
    this.server.emit('graphCreated', graph);
    
    // MQTT notification
    this.mqttService.publish('graphs/created', JSON.stringify(graph));
  }

  notifyGraphUpdated(graph: Graph) {
    // Socket.IO notification
    this.server.emit('graphUpdated', graph);
    
    // MQTT notification
    this.mqttService.publish('graphs/updated', JSON.stringify(graph));
  }

  notifyGraphDeleted(id: string) {
    // Socket.IO notification
    this.server.emit('graphDeleted', id);
    
    // MQTT notification
    this.mqttService.publish('graphs/deleted', id);
  }

  broadcastAllGraphs(graphs: Graph[]) {
    // Socket.IO broadcast
    this.server.emit('allGraphs', graphs);
    
    // MQTT broadcast
    this.mqttService.publish('graphs/all', JSON.stringify(graphs));
  }
}

