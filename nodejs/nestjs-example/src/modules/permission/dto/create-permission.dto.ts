import { ApiProperty } from '@nestjs/swagger';
import { IPermission } from '../interface/permission.interface';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { PermissionAction } from '@prisma/clients/postgresql';

export class CreatePermissionDto implements IPermission {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({
    enumName: 'PermissionAction',
    enum: ['manage', 'create', 'read', 'update', 'delete'],
    isArray: true,
    description: '权限动作',
  })
  @IsArray()
  @IsOptional()
  actions: PermissionAction[];

  @ApiProperty()
  @IsString()
  @IsOptional()
  resource: string;
}
