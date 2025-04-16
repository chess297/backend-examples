import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SigninRequest {
  // @ApiProperty()
  // @IsString()
  // @IsNotEmpty()
  // name: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    title: '邮箱',
    example: 'user@example.com',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    title: '密码',
    example: '123456',
  })
  password: string;
}

export class SigninResponse {
  // @ApiProperty({
  //   title: 'token',
  // })
  // access_token: string;
  @ApiProperty()
  success: boolean;
}
