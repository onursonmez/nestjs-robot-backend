import { PartialType } from '@nestjs/mapped-types';
import { CreateInstantActionDto } from './create-instant-action.dto';

export class UpdateInstantActionDto extends PartialType(CreateInstantActionDto) {}