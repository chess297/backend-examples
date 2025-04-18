import { Permission } from '@prisma/clients/postgresql';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationQuery } from '@/common/dto/pagination.dto';

export class FindPermissionQuery
  extends PaginationQuery
  implements Partial<Permission>
{
  @ApiProperty()
  name: string;
  @ApiProperty()
  resource: string;
}
