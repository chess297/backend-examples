import { User } from '@prisma/client';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RoleEntity } from '@/access/role/entities/role.entity';

export class UserEntity {
  @ApiProperty()
  @IsUUID()
  @IsOptional()
  id: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  username: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: '用户角色',
    type: [RoleEntity],
  })
  @IsArray()
  @IsOptional()
  roles?: RoleEntity[];

  @ApiProperty()
  @IsBoolean()
  is_active: boolean;

  @ApiProperty()
  create_at: Date;
  @ApiProperty()
  update_at: Date;
  delete_at: Date | null;
}
