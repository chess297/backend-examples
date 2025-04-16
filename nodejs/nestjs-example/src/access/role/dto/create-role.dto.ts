import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IRole } from '../interface/role.interface';

export class CreateRoleRequest implements Omit<IRole, 'id' | 'permissions'> {
  @ApiProperty({
    description: '角色名称',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: '角色描述',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: '权限ID列表',
    isArray: true,
    type: String,
  })
  permissions?: string[];

  @ApiProperty({
    description: '用户ID列表',
    isArray: true,
    type: String,
  })
  users?: string[];
}
