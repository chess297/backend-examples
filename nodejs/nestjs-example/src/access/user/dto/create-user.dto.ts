import { Exclude } from 'class-transformer';
import { IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserRequest {
  @ApiProperty({
    example: 'user',
  })
  username: string;

  @ApiProperty({
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    example: '123456',
  })
  password: string;

  @ApiProperty({
    title: '用户角色id列表',
  })
  @IsUUID()
  @IsOptional()
  role?: string | undefined;
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
