import { Permission } from '@prisma/clients/postgresql';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '@/common/dto/pagination.dto';

export class FindPermissionQuery
  extends PaginationDto
  implements Partial<Permission>
{
  @ApiProperty()
  name: string;
  @ApiProperty()
  resource: string;
}
