import { PartialType } from '@nestjs/mapped-types';
import { CreateCarrierTypeDto } from './create-carrier-type.dto';

export class UpdateCarrierTypeDto extends PartialType(CreateCarrierTypeDto) {}