import { Module } from '@nestjs/common';
import { AsasController } from './asas.controller';
import { AsasService } from './asas.service';
import { AsasGateway } from './asas.gateway';
@Module({
  controllers: [AsasController],
  providers: [AsasService, AsasGateway],
})
export class AsasModule { }