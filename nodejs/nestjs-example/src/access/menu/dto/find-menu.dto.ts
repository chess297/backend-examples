import { IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationQuery } from '@/common/dto/pagination.dto';
import { MenuEntity } from '../entities/menu.entity';

export class MenuResponse {
  @ApiProperty({
    description: '菜单ID',
  })
  id: string;

  @ApiProperty({
    description: '父菜单ID',
    required: false,
  })
  parent_id?: string | null;

  @ApiProperty({
    description: '菜单元数据ID',
    required: false,
  })
  mate_id?: string;

  @ApiProperty({
    description: '菜单名称',
  })
  title: string;

  @ApiProperty({
    description: '菜单路径',
  })
  path: string | null;

  @ApiProperty({
    description: '菜单图标',
  })
  icon: string;

  @ApiProperty({
    description: '菜单组件',
  })
  component: string | null;

  // @ApiProperty({
  //   description: '菜单分组',
  //   required: false,
  //   type: 'array',
  // })
  // groups?: any[];

  // @ApiProperty({
  //   description: '父菜单',
  //   required: false,
  // })
  // parent: {
  //   id: string;
  //   title: string;
  //   path: string | null;
  //   icon: string;
  //   component: string | null;
  // } | null;

  // @ApiProperty({
  //   description: '子菜单列表',
  //   required: false,
  //   type: 'array',
  // })
  // children?: {
  //   id: string;
  //   title: string;
  //   path: string;
  //   icon: string;
  //   component: string;
  // }[];

  @ApiProperty({
    description: '创建时间',
    required: false,
  })
  create_at?: Date;

  @ApiProperty({
    description: '更新时间',
    required: false,
  })
  update_at?: Date;
}

export class FindMenuQuery
  extends PaginationQuery
  implements Partial<MenuEntity>
{
  @ApiProperty({
    description: '菜单组ID',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  group_id?: string;

  @ApiProperty({
    description: '父级菜单ID',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  parent_id?: string | null;
}

export class FindManyMenuResponse {
  @ApiProperty({
    isArray: true,
    type: MenuEntity,
  })
  records: MenuEntity[];

  @ApiProperty()
  total: number;
}
