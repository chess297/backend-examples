import { Permission, Menu } from '@prisma/client';
import { IsArray, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '@/common/entity/base.entity';

export class MenuEntity extends BaseEntity implements Menu {
  icon: string;
  title: string;
  path: string | null;
  component: string | null;
  @IsUUID()
  mate_id: string;
  @IsUUID()
  @IsOptional()
  group_id: string | null;

  @IsUUID()
  @IsOptional()
  parent_id: string | null;

  @ApiProperty({
    description: '菜单父级',
  })
  parent?: Menu;

  @ApiProperty({
    description: '菜单子集',
  })
  @IsArray()
  children?: Menu[];

  @ApiProperty({
    description: '菜单需要的权限',
  })
  @IsOptional()
  permissions?: Permission;
}
