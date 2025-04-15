import { BaseEntity } from '@/common/entity/base.entity';
import { PermissionEntity } from '@/modules/permission/entities/permission.entity';
import { IRole } from '../interface/role.interface';

export class RoleEntity extends BaseEntity implements IRole {
  name: string;

  description: string;

  permissions: PermissionEntity[];
}
