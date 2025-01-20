import { WebSocketGateway, SubscribeMessage, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JobService } from '../services/job.service';
import { CreateJobDto } from '../dto/create-job.dto';
import { UpdateJobDto } from '../dto/update-job.dto';
import { MqttService } from '../services/mqtt.service';
import { Job } from '../schemas/job.schema';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  transports: ['websocket']
})
export class JobGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  private client: Socket;

  constructor(
    private readonly mqttService: MqttService,
    private readonly jobService: JobService,
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

  @SubscribeMessage('findAllJobs')
  async handleFindAllJobs() {
    const jobs = await this.jobService.findAll();
    return { event: 'allJobs', data: jobs };
  }

  @SubscribeMessage('findOneJob')
  async handleFindOne(client: Socket, id: string) {
    const job = await this.jobService.findOne(id);
    return { event: 'job', data: job };
  }

  @SubscribeMessage('jobCreate')
  async handleTypeCreate(client: Socket, createJobDto: CreateJobDto) {
    const job = await this.jobService.create(createJobDto);
    this.notifyJobCreated(job);
    return { event: 'jobCreated', data: job };
  }

  @SubscribeMessage('jobUpdate')
  async handleTypeUpdate(client: Socket, { id, updateJobDto }: { id: string; updateJobDto: UpdateJobDto }) {
    const job = await this.jobService.update(id, updateJobDto);
    this.notifyJobUpdated(job);
    return { event: 'jobUpdated', data: job };
  }

  @SubscribeMessage('jobDelete')
  async handleTypeDelete(client: Socket, id: string) {
    const job = await this.jobService.delete(id);
    this.notifyJobDeleted(id);
    return { event: 'jobDeleted', data: id };
  }

  notifyJobCreated(job: Job) {
    // Socket.IO notification
    this.server.emit('jobCreated', job);
    
    // MQTT notification
    this.mqttService.publish('jobs/created', JSON.stringify(job));
  }

  notifyJobUpdated(job: Job) {
    // Socket.IO notification
    this.server.emit('jobUpdated', job);
    
    // MQTT notification
    this.mqttService.publish('jobs/updated', JSON.stringify(job));
  }

  notifyJobDeleted(id: string) {
    // Socket.IO notification
    this.server.emit('jobDeleted', id);
    
    // MQTT notification
    this.mqttService.publish('jobs/deleted', id);
  }
}

