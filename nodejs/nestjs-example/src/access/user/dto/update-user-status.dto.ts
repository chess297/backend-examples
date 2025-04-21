import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserStatusDto {
  @ApiProperty({
    description: '用户状态',
    example: true,
    required: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean;

  @ApiProperty({
    description: '状态变更原因',
    example: '违反用户协议',
    required: false,
  })
  @IsString()
  @IsOptional()
  reason?: string;
}
