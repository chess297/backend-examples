import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '@/common/entity/base.entity';
import { IPermission } from '../interface/permission.interface';

export class PermissionEntity extends BaseEntity implements IPermission {
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

  @ApiProperty({
    description: '权限动作',
  })
  @IsString()
  action: string;

  @IsString()
  module: string;
}
