import { ApiProperty } from '@nestjs/swagger';
import { PaginationQuery } from '@/common/dto/pagination.dto';

export class FindMenuGroupQuery extends PaginationQuery {
  @ApiProperty()
  title?: string;
}
