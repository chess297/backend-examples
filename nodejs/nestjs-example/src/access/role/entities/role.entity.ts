import { Role } from '@prisma/client';
import { IsBoolean, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PermissionEntity } from '@/access/permission/entities/permission.entity';
import { BaseEntity } from '@/common/entity/base.entity';

export class RoleEntity extends BaseEntity implements Role {
  @ApiProperty()
  @IsBoolean()
  is_active: boolean;
  @ApiProperty({
    description: '角色名称',
  })
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  permissions?: PermissionEntity[];
}
