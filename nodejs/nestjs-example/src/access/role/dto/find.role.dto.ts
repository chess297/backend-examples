import { PaginationQuery } from '@/common/dto/pagination.dto';
import { RoleEntity } from '../entities/role.entity';

export class FindManyRoleQuery
  extends PaginationQuery
  implements Partial<RoleEntity>
{
  create_at?: Date | undefined;

  name?: string | undefined;
}
