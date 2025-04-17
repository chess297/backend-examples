import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { MenuEntity } from '../entities/menu.entity';

export class FindMenuQuery extends PaginationDto {
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
