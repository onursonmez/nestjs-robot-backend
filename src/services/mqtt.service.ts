import { Injectable, OnModuleInit } from '@nestjs/common';
import * as mqtt from 'mqtt';

@Injectable()
export class MqttService implements OnModuleInit {
  private client: mqtt.MqttClient;

  onModuleInit() {
    this.client = mqtt.connect('mqtt://localhost:1883', {
      clientId: `fleet-manager-${Math.random().toString(16).slice(3)}`,
    });

    this.client.on('connect', () => {
      console.log('Connected to MQTT broker');
      this.client.subscribe('robots/#');
    });

    this.client.on('message', (topic, message) => {
      console.log(`Received message on ${topic}: ${message.toString()}`);
    });
  }

  publish(topic: string, message: string) {
    this.client.publish(topic, message);
  }
}