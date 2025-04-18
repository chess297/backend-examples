import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MenuEntity } from '../entities/menu.entity';

export class CreateMenuRequest extends MenuEntity {
  @ApiProperty({
    description: '菜单分组ID',
  })
  @IsOptional()
  declare id: string;

  @ApiProperty({
    description: '菜单名称',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: '菜单图标',
  })
  @IsString()
  icon: string;

  @ApiProperty({
    description: '菜单路径',
  })
  @IsString()
  path: string;

  @ApiProperty({
    description: '菜单组件',
  })
  @IsString()
  component: string;

  @ApiProperty({
    description: '父级菜单ID',
  })
  declare parent_id: string;
}
