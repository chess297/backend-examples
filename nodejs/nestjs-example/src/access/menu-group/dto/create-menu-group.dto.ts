import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MenuGroupEntity } from '../entities/menu-group.entity';

export class CreateMenuGroupDto extends MenuGroupEntity {
  @ApiProperty()
  @IsString({ each: true })
  @IsOptional()
  menu_ids: string[];
}
