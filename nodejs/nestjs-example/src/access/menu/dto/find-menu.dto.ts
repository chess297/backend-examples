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
    description: '菜单名称',
  })
  title: string;

  @ApiProperty({
    description: '菜单路径',
  })
  path: string;

  @ApiProperty({
    description: '菜单图标',
  })
  icon: string;
  @ApiProperty({
    description: '菜单组件',
  })
  component: string;
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
