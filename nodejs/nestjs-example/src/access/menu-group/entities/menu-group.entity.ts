import { MenuGroup } from '@prisma/clients/postgresql';
import { IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
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

  @ApiProperty()
  @IsString({ each: true })
  @IsOptional()
  menu_ids: string[];
}
