import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Job } from '../schemas/job.schema';
import { CreateJobDto } from '../dto/create-job.dto';
import { UpdateJobDto } from '../dto/update-job.dto';

@Injectable()
export class JobService {
  constructor(
    @InjectModel(Job.name) private jobModel: Model<Job>,
  ) {}

  async findAll(): Promise<Job[]> {
    return this.jobModel.find().exec();
  }

  async findOne(id: string): Promise<Job> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid job ID format');
    }
    return this.jobModel.findById(id).exec();
  }

  async create(createJobDto: CreateJobDto): Promise<Job> {
    const createdJob = new this.jobModel(createJobDto);
    return createdJob.save();
  }

  async update(id: string, updateJobDto: UpdateJobDto): Promise<Job> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid job ID format');
    }
    return this.jobModel
      .findByIdAndUpdate(id, updateJobDto, { new: true })
      .exec();
  }

  async delete(id: string): Promise<Job> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid job ID format');
    }
    return this.jobModel.findByIdAndDelete(id).exec();
  }
}