import { RoleEntity } from '@/access/role/entities/role.entity';

export class UserEntity {
  id: string;

  name: string;

  email: string;

  password: string;

  roles?: RoleEntity[];
}
