import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationQuery } from '@/common/dto/pagination.dto';

export class FindDictionaryDto extends PaginationQuery {
  @ApiPropertyOptional({ description: '字典代码' })
  @IsString()
  @IsOptional()
  code?: string;

  @ApiPropertyOptional({ description: '字典名称' })
  @IsString()
  @IsOptional()
  name?: string;
}
