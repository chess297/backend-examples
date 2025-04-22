import { PartialType } from '@nestjs/swagger';
import { CreateMenuGroupRequest } from './create-menu-group.dto';

export class UpdateMenuGroupRequest extends PartialType(
  CreateMenuGroupRequest,
) {}
