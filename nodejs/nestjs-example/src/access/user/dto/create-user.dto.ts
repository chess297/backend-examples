import { Exclude } from 'class-transformer';
import { IsArray, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../entities/user.entity';

export class CreateUserRequest extends UserEntity {
  @ApiProperty({
    title: '用户角色id列表',
    type: [String],
  })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  roleIds?: string[];

  @ApiProperty()
  declare password: string;
}

export class UserResponse extends UserEntity {
  constructor(partial: Partial<UserResponse>) {
    super();
    Object.assign(this, partial);
  }

  @Exclude()
  declare password: string;
}
