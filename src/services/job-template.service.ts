import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { JobTemplate } from '../schemas/job-template.schema';
import { CreateJobTemplateDto } from '../dto/create-job-template.dto';
import { UpdateJobTemplateDto } from '../dto/update-job-template.dto';

@Injectable()
export class JobTemplateService {
  constructor(
    @InjectModel(JobTemplate.name) private jobTemplateModel: Model<JobTemplate>,
  ) {}

  async findAll(): Promise<JobTemplate[]> {
    return this.jobTemplateModel.find().exec();
  }

  async findOne(id: string): Promise<JobTemplate> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid job template ID format');
    }
    return this.jobTemplateModel.findById(id).exec();
  }

  async create(createJobTemplateDto: CreateJobTemplateDto): Promise<JobTemplate> {
    const createdJobTemplate = new this.jobTemplateModel(createJobTemplateDto);
    return createdJobTemplate.save();
  }

  async update(id: string, updateJobTemplateDto: UpdateJobTemplateDto): Promise<JobTemplate> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid job template ID format');
    }
    return this.jobTemplateModel
      .findByIdAndUpdate(id, updateJobTemplateDto, { new: true })
      .exec();
  }

  async delete(id: string): Promise<JobTemplate> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid job template ID format');
    }
    return this.jobTemplateModel.findByIdAndDelete(id).exec();
  }
}