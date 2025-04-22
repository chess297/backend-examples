import { PartialType } from '@nestjs/swagger';
import { CreateRoleRequest } from './create-role.dto';

export class UpdateRoleRequest extends PartialType(CreateRoleRequest) {}
