import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CompleteUploadDto {
  @ApiProperty({
    description: '文件 key',
    example: '5a7b9c4d-1234-5678-90ab-cdefghijklmn.jpg',
  })
  @IsNotEmpty({ message: 'key 不能为空' })
  @IsString({ message: 'key 必须是字符串' })
  key: string;

  @ApiProperty({ description: '原始文件名', example: 'example.jpg' })
  @IsNotEmpty({ message: '原始文件名不能为空' })
  @IsString({ message: '原始文件名必须是字符串' })
  originalName: string;

  @ApiProperty({ description: '文件类型', example: 'image/jpeg' })
  @IsNotEmpty({ message: '文件类型不能为空' })
  @IsString({ message: '文件类型必须是字符串' })
  contentType: string;

  @ApiProperty({ description: '文件大小（字节）', example: 1024 })
  @IsNotEmpty({ message: '文件大小不能为空' })
  @IsNumber({}, { message: '文件大小必须是数字' })
  @Min(1, { message: '文件大小必须大于 0' })
  size: number;
}
