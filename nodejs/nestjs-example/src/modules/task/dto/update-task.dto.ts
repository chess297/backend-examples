import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskRequest } from './create-task.dto';

export class UpdateTaskRequest extends PartialType(CreateTaskRequest) {}
