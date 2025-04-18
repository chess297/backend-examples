import { Permission, Menu } from '@prisma/clients/postgresql';
import { IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MenuMateEntity } from '@/access/menu-mate/entities/menu-mate.entity';
import { BaseEntity } from '@/common/entity/base.entity';

export class MenuEntity extends BaseEntity implements Menu {
  @IsUUID()
  @IsOptional()
  group_id: string | null;

  @IsUUID()
  @IsOptional()
  parent_id: string | null;

  parent?: Menu;

  children?: Menu[];

  permissions?: Permission;

  mate: MenuMateEntity;
}
