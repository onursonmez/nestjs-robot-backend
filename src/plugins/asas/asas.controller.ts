import { Controller, Get, Post, Put, Delete, Body, Param, NotFoundException, BadRequestException } from '@nestjs/common';
import { AsasService } from './asas.service';

@Controller('asas')
export class AsasController {
  constructor(private readonly asasService: AsasService) {}

  @Post('cells')
  async cells(@Body() body: { values: { id: string; v: string }[] }) {
    if (!body.values || !Array.isArray(body.values)) {
      throw new BadRequestException('Invalid request body');
    }

    const parsedData = body.values.map(({ id, v }) => {
      const [type, location, partNumber] = v.split(', ').map((item) => item.trim());
      return { id, type, location, partNumber };
    });

    return { message: 'Data processed successfully', data: parsedData };
  }

  @Post('write')
  async write(@Body() body: { id: string; v: string }[]) {
    if (!Array.isArray(body) || body.length === 0) {
      throw new BadRequestException('Invalid request body');
    }

    const parsedData = body.map(({ id, v }) => {
      if (typeof v !== 'string') {
        throw new BadRequestException(`Invalid value for 'v': ${v}`);
      }

      const [type, location, spareNumber] = v.split(',').map((item) => item.trim());
      return { id: id.trim(), type, location, spareNumber };
    });

    return { message: 'Data processed successfully', data: parsedData };
  }

  @Post('handshake')
  async handshake(@Body() body: { values: { id: string; v: string }[] }) {
    if (!body.values || !Array.isArray(body.values)) {
      throw new BadRequestException('Invalid request body');
    }

    const parsedData = body.values.map(({ id, v }) => {
      const [type, location, partNumber] = v.split(', ').map((item) => item.trim());
      return { id, type, location, partNumber };
    });

    return { message: 'Data processed successfully', data: parsedData };
  }
}