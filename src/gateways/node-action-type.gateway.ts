import { WebSocketGateway, SubscribeMessage, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NodeActionTypeService } from '../services/node-action-type.service';
import { CreateNodeActionTypeDto } from '../dto/create-node-action-type.dto';
import { UpdateNodeActionTypeDto } from '../dto/update-node-action-type.dto';
import { MqttService } from '../services/mqtt.service';
import { NodeActionType } from '../schemas/node-action-type.schema';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  transports: ['websocket']
})
export class NodeActionTypeGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  private client: Socket;

  constructor(
    private readonly mqttService: MqttService,
    private readonly nodeActionTypeService: NodeActionTypeService,
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

  @SubscribeMessage('findAllNodeActionTypes')
  async handleFindAll() {
    const nodeActionTypes = await this.nodeActionTypeService.findAll();
    return { event: 'allNodeActionTypes', data: nodeActionTypes };
  }

  @SubscribeMessage('findOneNodeActionType')
  async handleFindOne(client: Socket, id: string) {
    const nodeActionType = await this.nodeActionTypeService.findOne(id);
    return { event: 'nodeActionType', data: nodeActionType };
  }

  @SubscribeMessage('nodeActionTypeCreate')
  async handleCreate(client: Socket, createNodeActionTypeDto: CreateNodeActionTypeDto) {
    const nodeActionType = await this.nodeActionTypeService.create(createNodeActionTypeDto);
    this.notifyNodeActionTypeCreated(nodeActionType);
    return { event: 'nodeActionTypeCreated', data: nodeActionType };
  }

  @SubscribeMessage('nodeActionTypeUpdate')
  async handleUpdate(client: Socket, {id, updateNodeActionTypeDto}: { id: string; updateNodeActionTypeDto: UpdateNodeActionTypeDto }) {
    const nodeActionType = await this.nodeActionTypeService.update(id, updateNodeActionTypeDto);
    this.notifyNodeActionTypeUpdated(nodeActionType);
    return { event: 'nodeActionTypeUpdated', data: nodeActionType };
  }

  @SubscribeMessage('nodeActionTypeDelete')
  async handleDelete(client: Socket, id: string) {
    const nodeActionType = await this.nodeActionTypeService.delete(id);
    this.notifyNodeActionTypeDeleted(id);
    return { event: 'nodeActionTypeDeleted', data: id };
  }

  notifyNodeActionTypeCreated(nodeActionType: NodeActionType) {
    this.server.emit('nodeActionTypeCreated', nodeActionType);    
    this.mqttService.publish('nodeActionTypes/created', JSON.stringify(nodeActionType));
  }

  notifyNodeActionTypeUpdated(nodeActionType: NodeActionType) {
    this.server.emit('nodeActionTypeUpdated', nodeActionType);
    this.mqttService.publish('nodeActionTypes/updated', JSON.stringify(nodeActionType));
  }

  notifyNodeActionTypeDeleted(id: string) {
    this.server.emit('nodeActionTypeDeleted', id);    
    this.mqttService.publish('nodeActionTypes/deleted', id);
  }

  broadcastAllNodeActionTypes(nodeActionTypes: NodeActionType[]) {
    this.server.emit('allNodeActionTypes', nodeActionTypes);
    this.mqttService.publish('nodeActionTypes/all', JSON.stringify(nodeActionTypes));
  }
}

