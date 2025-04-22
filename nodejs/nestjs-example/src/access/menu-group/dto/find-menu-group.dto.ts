import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationQuery } from '@/common/dto/pagination.dto';

export class MenuGroupQuery extends PaginationQuery {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  title?: string;
}
