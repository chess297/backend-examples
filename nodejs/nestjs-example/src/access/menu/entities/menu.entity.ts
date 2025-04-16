import { Permission, Menu } from '@prisma/clients/postgresql';
import { IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MenuEntity implements Menu {
  @ApiProperty()
  id: string;
  @ApiProperty()
  @IsString()
  name: string;
  @ApiProperty()
  @IsString()
  path: string;
  @ApiProperty()
  @IsString()
  icon: string;
  @ApiProperty()
  @IsString()
  component: string;

  @IsUUID()
  @IsOptional()
  parent_id: string | null;

  parent?: Menu;

  children?: Menu[];

  permissions?: Permission;

  create_at: Date;

  update_at: Date;

  delete_at: Date | null;
}
