import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * 分页参数
 * @description 分页参数
 */
export class PaginationQuery {
  @ApiProperty({
    description: '当前页码',
    default: 1,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => +value)
  @Min(1, {
    message: 'page 必须大于等于 1',
  })
  page: number = 1;

  @ApiProperty({
    description: '每页显示条数',
    default: 10,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => +value)
  @Min(0, {
    message: 'limit 必须大于等于 0',
  })
  limit: number = 10;
}
