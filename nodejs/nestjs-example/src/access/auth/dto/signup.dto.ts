import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '@/access/user/entities/user.entity';

export class SignupRequest {
  @ApiProperty({
    example: 'user',
  })
  @IsString()
  username: string;

  @ApiProperty({
    example: 'user@example.com',
  })
  @IsString()
  email: string;

  @ApiProperty({
    example: '123456',
  })
  @IsString()
  password: string;
}

export class SignupResponse {
  @ApiProperty()
  id: string;
}
