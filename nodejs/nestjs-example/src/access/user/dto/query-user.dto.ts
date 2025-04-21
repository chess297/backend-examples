import { Transform } from 'class-transformer';
import { IsOptional, IsString, IsInt, Min, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class QueryUserDto {
  @ApiProperty({ description: '用户名搜索', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: '邮箱搜索', required: false })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ description: '页码', default: 1, required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => +value)
  page?: number = 1;

  @ApiProperty({ description: '每页数量', default: 10, required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => +value)
  pageSize?: number = 10;

  @ApiProperty({
    description: '是否包含软删除的用户',
    default: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  includeDeleted?: boolean = false;
}
