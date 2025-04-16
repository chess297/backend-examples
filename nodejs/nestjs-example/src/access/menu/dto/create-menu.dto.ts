import { ApiProperty } from '@nestjs/swagger';
import { MenuEntity } from '../entities/menu.entity';

export class CreateMenuRequest extends MenuEntity {
  @ApiProperty({
    description: '菜单名称',
  })
  declare name: string;
  @ApiProperty({
    description: '菜单路径',
  })
  declare path: string;
  @ApiProperty({
    description: '菜单图标',
  })
  declare icon: string;
  @ApiProperty({
    description: '组件',
  })
  declare component: string;

  @ApiProperty({
    description: '父级菜单ID',
  })
  declare parent_id: string;
}
