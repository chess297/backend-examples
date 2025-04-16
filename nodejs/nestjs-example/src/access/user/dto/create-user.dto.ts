import { Exclude } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RoleEntity } from '@/access/role/entities/role.entity';
import { UserEntity } from '../entities/user.entity';

export class CreateUserRequest extends UserEntity {
  @ApiProperty({
    example: 'user',
  })
  @IsString()
  @IsNotEmpty()
  declare name: string;

  @ApiProperty({
    example: 'user@example.com',
  })
  @IsString()
  @IsNotEmpty()
  declare email: string;

  @ApiProperty({
    example: '123456user',
  })
  @IsString()
  @IsNotEmpty()
  declare password: string;

  @IsArray()
  @IsOptional()
  declare roles?: RoleEntity[] | undefined;
}

export class GetUserResponse extends CreateUserRequest {
  constructor(partial: Partial<GetUserResponse>) {
    super();
    Object.assign(this, partial);
  }

  @Exclude()
  delete_at?: Date;

  @Exclude()
  declare password: string;
}
