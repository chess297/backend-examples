import { PartialType } from '@nestjs/swagger';
import { CreateMenuGroupRequest } from './create-menu-group.dto';

export class UpdateMenuGroupDto extends PartialType(CreateMenuGroupRequest) {}
