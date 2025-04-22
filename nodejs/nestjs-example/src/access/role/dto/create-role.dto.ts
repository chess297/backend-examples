import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RoleEntity } from '../entities/role.entity';

export class CreateRoleRequest {
  @ApiProperty({
    description: '角色名称',
  })
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({
    description: '是否激活',
  })
  @IsBoolean()
  is_active: boolean;

  @ApiProperty({
    description: '权限ID列表',
    type: [String],
  })
  @IsArray({ each: true })
  @IsString({ each: true })
  @IsOptional()
  permission_ids?: string[];

  @ApiProperty({
    description: '用户ID列表',
    type: [String],
  })
  @IsArray({ each: true })
  @IsString({ each: true })
  @IsOptional()
  user_ids?: string[];
}

export class RoleResponse extends RoleEntity {
  constructor(role: Partial<CreateRoleResponse>) {
    super();
    Object.assign(this, role);
  }
}

export class CreateRoleResponse extends RoleResponse {
  constructor(role: Partial<CreateRoleResponse>) {
    super(role);
    Object.assign(this, role);
  }
}
