import { ApiProperty } from '@nestjs/swagger';
import { PaginationQuery } from '@/common/dto/pagination.dto';
import { MenuEntity } from '../entities/menu.entity';

export class FindMenuQuery extends PaginationQuery {
  declare name: string;
}

export class FindManyMenuResponse {
  @ApiProperty({
    isArray: true,
    type: MenuEntity,
  })
  records: MenuEntity[];

  @ApiProperty()
  total: number;
}
