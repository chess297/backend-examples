import { MenuMate } from '@prisma/clients/postgresql';
import { IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '@/common/entity/base.entity';

export class MenuMateEntity extends BaseEntity implements MenuMate {
  @ApiProperty()
  @IsUUID()
  menu_id: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  path: string;

  @ApiProperty()
  @IsString()
  icon: string;

  @ApiProperty()
  @IsString()
  component: string;
}
