import { PartialType } from '@nestjs/mapped-types';
import { CreateNodeActionTypeDto } from './create-node-action-type.dto';

export class UpdateNodeActionTypeDto extends PartialType(CreateNodeActionTypeDto) {}