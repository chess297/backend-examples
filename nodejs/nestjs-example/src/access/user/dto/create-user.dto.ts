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
import { UserEntity } from '../entities/user.entity';

export class CreateUserRequest {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  declare password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string;

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

  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsOptional()
  avatar_url: string | null;

  @ApiProperty({
    title: '用户角色id列表',
    type: [String],
  })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  role_ids?: string[];
}

export class UserResponse extends UserEntity {
  constructor(partial: Partial<UserResponse>) {
    super();
    Object.assign(this, partial);
  }

  @Exclude()
  declare password: string;
}
