import { StorageType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UploadResponseDto {
  @ApiProperty({ description: '附件ID' })
  id: string;

  @ApiProperty({ description: '原始文件名' })
  originalName: string;

  @ApiProperty({ description: '文件MIME类型' })
  mimeType: string;

  @ApiProperty({ description: '文件大小（字节）' })
  size: number;

  @ApiProperty({ description: '文件访问URL' })
  url: string;

  @ApiProperty({ description: '存储类型', enum: StorageType })
  storageType: StorageType;
}
