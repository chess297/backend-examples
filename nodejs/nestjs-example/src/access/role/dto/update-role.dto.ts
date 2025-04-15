import { PartialType } from '@nestjs/swagger';
import { CreateRoleRequest } from './create-role.dto';

export class UpdateRoleDto extends PartialType(CreateRoleRequest) {}
