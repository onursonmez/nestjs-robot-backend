import { NestFactory } from '@nestjs/core';
import { EventEmitter } from 'events';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.enableCors({
  //   origin: '*',
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  //   credentials: true, 
  // });
  EventEmitter.defaultMaxListeners = 20;
  app.useWebSocketAdapter(new IoAdapter(app));
  await app.listen(3001);
  console.log('Application is running on: http://localhost:3001');
}
bootstrap();