import { Role } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { PermissionEntity } from '@/access/permission/entities/permission.entity';
import { BaseEntity } from '@/common/entity/base.entity';

export class RoleEntity extends BaseEntity implements Role {
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  permissions?: PermissionEntity[];
}
