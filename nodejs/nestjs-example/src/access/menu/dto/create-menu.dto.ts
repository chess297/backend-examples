import { IsArray, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMenuRequest {
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
  parent_id: string;

  @ApiProperty({
    description: '菜单分组ID',
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  groups: string[];
}
