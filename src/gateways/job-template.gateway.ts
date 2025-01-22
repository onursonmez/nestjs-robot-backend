import { WebSocketGateway, SubscribeMessage, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JobTemplateService } from '../services/job-template.service';
import { CreateJobTemplateDto } from '../dto/create-job-template.dto';
import { UpdateJobTemplateDto } from '../dto/update-job-template.dto';
import { MqttService } from '../services/mqtt.service';
import { JobTemplate } from '../schemas/job-template.schema';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  transports: ['websocket']
})
export class JobTemplateGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  private client: Socket;

  constructor(
    private readonly mqttService: MqttService,
    private readonly jobTemplateService: JobTemplateService,
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

  @SubscribeMessage('findAllJobTemplates')
  async handleFindAllJobTemplates() {
    const jobTemplates = await this.jobTemplateService.findAll();
    return { event: 'allJobTemplates', data: jobTemplates };
  }

  @SubscribeMessage('findOneJobTemplate')
  async handleFindOne(client: Socket, id: string) {
    const jobTemplate = await this.jobTemplateService.findOne(id);
    return { event: 'jobTemplate', data: jobTemplate };
  }

  @SubscribeMessage('jobTemplateCreate')
  async handleTypeCreate(client: Socket, createJobTemplateDto: CreateJobTemplateDto) {
    const jobTemplate = await this.jobTemplateService.create(createJobTemplateDto);
    this.notifyJobTemplateCreated(jobTemplate);
    return { event: 'jobTemplateCreated', data: jobTemplate };
  }

  @SubscribeMessage('jobTemplateUpdate')
  async handleTypeUpdate(client: Socket, { id, updateJobTemplateDto }: { id: string; updateJobTemplateDto: UpdateJobTemplateDto }) {
    const jobTemplate = await this.jobTemplateService.update(id, updateJobTemplateDto);
    this.notifyJobTemplateUpdated(jobTemplate);
    return { event: 'jobTemplateUpdated', data: jobTemplate };
  }

  @SubscribeMessage('jobTemplateDelete')
  async handleTypeDelete(client: Socket, id: string) {
    const jobTemplate = await this.jobTemplateService.delete(id);
    this.notifyJobTemplateDeleted(id);
    return { event: 'jobTemplateDeleted', data: id };
  }

  notifyJobTemplateCreated(jobTemplate: JobTemplate) {
    // Socket.IO notification
    this.server.emit('jobTemplateCreated', jobTemplate);
    
    // MQTT notification
    this.mqttService.publish('jobTemplate/created', JSON.stringify(jobTemplate));
  }

  notifyJobTemplateUpdated(jobTemplate: JobTemplate) {
    // Socket.IO notification
    this.server.emit('jobTemplateUpdated', jobTemplate);
    
    // MQTT notification
    this.mqttService.publish('jobTemplate/updated', JSON.stringify(jobTemplate));
  }

  notifyJobTemplateDeleted(id: string) {
    // Socket.IO notification
    this.server.emit('jobTemplateDeleted', id);
    
    // MQTT notification
    this.mqttService.publish('jobTemplate/deleted', id);
  }
}

