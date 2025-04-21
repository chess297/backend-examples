import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationQuery } from '@/common/dto/pagination.dto';
import { PermissionEntity } from '../entities/permission.entity';

export class FindPermissionQuery
  extends PaginationQuery
  implements Partial<PermissionEntity>
{
  @ApiProperty({
    description: '权限名称',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: '权限描述',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: '资源名称',
    required: false,
  })
  @IsString()
  @IsOptional()
  resource?: string;
}
