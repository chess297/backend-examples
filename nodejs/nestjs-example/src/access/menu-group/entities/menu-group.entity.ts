import { MenuGroup } from '@prisma/client';
import { IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MenuResponse } from '@/access/menu/dto/find-menu.dto';
import { BaseEntity } from '@/common/entity/base.entity';

export class MenuGroupEntity extends BaseEntity implements MenuGroup {
  @ApiProperty()
  @IsString()
  icon: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsUUID()
  @IsOptional()
  parent_id: string | null;

  @ApiProperty({
    type: [MenuResponse],
  })
  menus?: MenuResponse[];
}
