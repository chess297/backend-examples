import { IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationQuery } from '@/common/dto/pagination.dto';
import { MenuMateEntity } from '../entities/menu-mate.entity';

export class FindMenuMateQuery
  extends PaginationQuery
  implements Partial<MenuMateEntity>
{
  @ApiProperty({
    description: '菜单ID',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  menu_id?: string;

  @ApiProperty({
    description: '标题',
    required: false,
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    description: '路径',
    required: false,
  })
  @IsString()
  @IsOptional()
  path?: string;

  @ApiProperty({
    description: '图标',
    required: false,
  })
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiProperty({
    description: '组件',
    required: false,
  })
  @IsString()
  @IsOptional()
  component?: string;
}
