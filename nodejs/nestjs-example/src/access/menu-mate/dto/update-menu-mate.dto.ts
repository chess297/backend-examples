import { PartialType } from '@nestjs/swagger';
import { CreateMenuMateDto } from './create-menu-mate.dto';

export class UpdateMenuMateDto extends PartialType(CreateMenuMateDto) {}
