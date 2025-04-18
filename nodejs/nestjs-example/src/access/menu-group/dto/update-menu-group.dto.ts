import { PartialType } from '@nestjs/swagger';
import { CreateMenuGroupDto } from './create-menu-group.dto';

export class UpdateMenuGroupDto extends PartialType(CreateMenuGroupDto) {}
