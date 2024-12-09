import { Injectable, OnModuleInit, OnModuleDestroy, Inject, forwardRef } from '@nestjs/common';
import * as mqtt from 'mqtt';
import { RobotGateway } from 'src/gateways/robot.gateway';

@Injectable()
export class MqttService implements OnModuleInit, OnModuleDestroy {
  private client: mqtt.MqttClient;

  constructor(
    @Inject(forwardRef(() => RobotGateway))
    private readonly robotGateway: RobotGateway,
  ) {}


  async onModuleInit() {

    this.client = mqtt.connect('mqtt://localhost:1883', {
      clientId: `fleet-manager-${Math.random().toString(16).slice(3)}`,
    });

    this.client.on('connect', () => {
      console.log('Connected to MQTT broker');
      this.client.subscribe('#');
    });

    this.client.on('message', async (topic, message) => {
      console.log(`Received message on ${topic}: ${message.toString()}`);

      if(topic === 'robots/publish') {
        // Forward MQTT message to Socket.IO clients
        this.robotGateway.handlePublish(JSON.parse(message.toString()));
        return;
      }

      if(topic === 'robot/create') {
        // Forward MQTT message to Socket.IO clients
        this.robotGateway.handleCreate(JSON.parse(message.toString()));
        return;
      }
    });

  }

  onModuleDestroy() {
    if (this.client) {
      this.client.end();
    }
  }

  publish(topic: string, message: string) {
    if (this.client && this.client.connected) {
      this.client.publish(topic, message);
    } else {
      console.error('MQTT client is not connected');
    }
  }
}