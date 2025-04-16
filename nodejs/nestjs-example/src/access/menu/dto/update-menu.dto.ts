import { PartialType } from '@nestjs/swagger';
import { CreateMenuRequest } from './create-menu.dto';

export class UpdateMenuDto extends PartialType(CreateMenuRequest) {}
