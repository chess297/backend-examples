import { ApiProperty } from '@nestjs/swagger';
import { PaginationInterface } from '@/common/interface/pagination.interface';
import { MenuEntity } from '../entities/menu.entity';

export class FindMenuRequest implements PaginationInterface {
  declare name: string;

  page?: number;

  limit?: number;
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
