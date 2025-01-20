import { Controller, Get, Post, Put, Delete, Body, Param, NotFoundException, BadRequestException } from '@nestjs/common';
import { JobService } from '../services/job.service';
import { CreateJobDto } from '../dto/create-job.dto';
import { UpdateJobDto } from '../dto/update-job.dto';

@Controller('jobs')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Get()
  async findAll() {
    return this.jobService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const job = await this.jobService.findOne(id);
      if (!job) {
        throw new NotFoundException('Job not found');
      }
      return job;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new NotFoundException('Job not found');
    }
  }

  @Post()
  async create(@Body() createJobDto: CreateJobDto) {
    return this.jobService.create(createJobDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto) {
    try {
      const job = await this.jobService.update(id, updateJobDto);
      if (!job) {
        throw new NotFoundException('Job not found');
      }
      return job;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new NotFoundException('Job not found');
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    try {
      const job = await this.jobService.delete(id);
      if (!job) {
        throw new NotFoundException('Job not found');
      }
      return job;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new NotFoundException('Job not found');
    }
  }
}