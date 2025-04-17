import { PaginationDto } from '@/common/dto/pagination.dto';
import { RoleEntity } from '../entities/role.entity';

export class FindManyRoleQuery
  extends PaginationDto
  implements Partial<RoleEntity>
{
  create_at?: Date | undefined;

  name?: string | undefined;
}
