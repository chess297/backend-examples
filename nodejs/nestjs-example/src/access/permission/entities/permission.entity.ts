import { $Enums, Permission } from '@prisma/clients/postgresql';
import { IsArray, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '@/common/entity/base.entity';

export class PermissionEntity extends BaseEntity implements Permission {
  @ApiProperty({
    description: '权限名称',
  })
  @IsString()
  name: string;
  @ApiProperty({
    description: '权限描述',
  })
  @IsString()
  description: string;

  @IsString()
  module: string;

  @ApiProperty({
    description: '权限动作列表',
    enum: $Enums.PermissionAction,
    isArray: true,
  })
  @IsString({ each: true })
  @IsArray()
  actions: $Enums.PermissionAction[];

  @ApiProperty({
    description: '资源名称',
  })
  @IsString()
  resource: string;
}
