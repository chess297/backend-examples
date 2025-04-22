import { User } from '@prisma/client';
import { Exclude } from 'class-transformer';
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
import { BaseEntity } from '@/common/entity/base.entity';

export class UserEntity extends BaseEntity implements User {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string;

  // @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsArray()
  @IsOptional()
  roles?: RoleEntity[];

  @ApiProperty()
  @IsBoolean()
  is_active: boolean;

  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsOptional()
  phone: string | null;

  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsOptional()
  country_code: string | null;

  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsOptional()
  address: string | null;
}
