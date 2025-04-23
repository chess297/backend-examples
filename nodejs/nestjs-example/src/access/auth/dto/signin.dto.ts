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
  @ApiProperty({
    title: '用户ID',
    example: '1',
    required: false,
  })
  id?: string;

  @ApiProperty({
    title: '用户邮箱',
    example: 'user@example.com',
    required: false,
  })
  email?: string;

  @ApiProperty({
    title: '用户名称',
    example: 'John Doe',
    required: false,
  })
  username?: string;

  @ApiProperty({
    title: '是否是管理员',
    example: false,
    required: false,
  })
  is_admin?: boolean;

  @ApiProperty({
    title: '用户权限列表',
    type: [String],
    required: false,
  })
  permissions?: string[];
}
