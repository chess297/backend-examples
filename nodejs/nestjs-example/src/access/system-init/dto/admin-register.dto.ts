import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AdminRegisterRequest {
  @ApiProperty({
    description: '系统码',
    example: 'ABCD1234-5678-EFGH-9012-IJKLMNOPQRST',
  })
  @IsString()
  @IsNotEmpty()
  systemCode: string;

  @ApiProperty({
    description: '管理员用户名',
    example: 'admin',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: '管理员邮箱',
    example: 'admin@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: '管理员密码',
    example: 'password123',
  })
  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: '手机号',
    example: '1234567890',
    required: false,
  })
  @IsString()
  @IsOptional()
  phone: string;

  @ApiProperty({
    description: '国家代码',
    example: '+86',
    required: false,
  })
  @IsString()
  @IsOptional()
  country_code: string;

  @ApiProperty({
    description: '地址',
    example: '北京市朝阳区',
    required: false,
  })
  @IsString()
  @IsOptional()
  address: string;
}

export class AdminRegisterResponse {}

export class CheckSystemInitResponse {
  @ApiProperty({
    description: '系统初始化状态',
  })
  @IsBoolean()
  initialized: boolean;
}
