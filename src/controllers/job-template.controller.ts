import { Controller, Get, Post, Put, Delete, Body, Param, NotFoundException, BadRequestException } from '@nestjs/common';
import { JobTemplateService } from '../services/job-template.service';
import { CreateJobTemplateDto } from '../dto/create-job-template.dto';
import { UpdateJobTemplateDto } from '../dto/update-job-template.dto';

@Controller('job-templates')
export class JobTemplateController {
  constructor(private readonly jobTemplateService: JobTemplateService) {}

  @Get()
  async findAll() {
    return this.jobTemplateService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const jobTemplate = await this.jobTemplateService.findOne(id);
      if (!jobTemplate) {
        throw new NotFoundException('Job template not found');
      }
      return jobTemplate;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new NotFoundException('Job template not found');
    }
  }

  @Post()
  async create(@Body() createJobTemplateDto: CreateJobTemplateDto) {
    return this.jobTemplateService.create(createJobTemplateDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateJobTemplateDto: UpdateJobTemplateDto) {
    try {
      const jobTemplate = await this.jobTemplateService.update(id, updateJobTemplateDto);
      if (!jobTemplate) {
        throw new NotFoundException('Job template not found');
      }
      return jobTemplate;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new NotFoundException('Job template not found');
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    try {
      const jobTemplate = await this.jobTemplateService.delete(id);
      if (!jobTemplate) {
        throw new NotFoundException('Job template not found');
      }
      return jobTemplate;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new NotFoundException('Job template not found');
    }
  }
}