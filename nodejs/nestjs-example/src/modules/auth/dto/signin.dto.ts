import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SigninRequest {
  // @ApiProperty()
  // @IsString()
  // @IsNotEmpty()
  // name: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    title: '邮箱',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    title: '密码',
  })
  password: string;
}

export class SigninResponse {
  @ApiProperty({
    title: 'token',
  })
  access_token: string;
}
