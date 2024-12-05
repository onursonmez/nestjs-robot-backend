import { PartialType } from '@nestjs/mapped-types';
import { CreateRobotTypeDto } from './create-robot-type.dto';

export class UpdateRobotTypeDto extends PartialType(CreateRobotTypeDto) {}