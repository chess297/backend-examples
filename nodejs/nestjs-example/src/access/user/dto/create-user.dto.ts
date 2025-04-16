import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { RoleEntity } from '@/access/role/entities/role.entity';
import { UserEntity } from '../entities/user.entity';

export class CreateUserRequest extends UserEntity {
  @ApiProperty({
    example: 'user',
  })
  declare name: string;

  @ApiProperty({
    example: 'user@example.com',
  })
  declare email: string;

  @ApiProperty({
    example: '123456user',
  })
  declare password: string;

  @ApiProperty({
    title: '用户角色id列表',
    example: '123456user',
    isArray: true,
  })
  declare roles?: RoleEntity[] | undefined;
}

export class GetUserResponse extends CreateUserRequest {
  constructor(partial: Partial<GetUserResponse>) {
    super();
    Object.assign(this, partial);
  }

  @Exclude()
  declare delete_at: Date | null;

  @Exclude()
  declare password: string;
}
