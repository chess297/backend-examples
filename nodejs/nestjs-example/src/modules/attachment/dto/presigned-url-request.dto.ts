import { IsNotEmpty, IsString, IsOptional, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PresignedUrlRequestDto {
  @ApiProperty({ description: '文件名', example: 'example.jpg' })
  @IsNotEmpty({ message: '文件名不能为空' })
  @IsString({ message: '文件名必须是字符串' })
  filename: string;

  @ApiProperty({ description: '文件类型', example: 'image/jpeg' })
  @IsNotEmpty({ message: '文件类型不能为空' })
  @IsString({ message: '文件类型必须是字符串' })
  contentType: string;

  @ApiProperty({ description: '过期时间（秒）', example: 300, required: false })
  @IsOptional()
  @IsInt({ message: '过期时间必须是整数' })
  @Min(1, { message: '过期时间必须大于 0' })
  expiry?: number;
}
