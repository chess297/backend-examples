import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '@/access/user/entities/user.entity';

export class SignupRequest extends UserEntity {
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
}

export class SignupResponse {
  @ApiProperty()
  id: string;
}
