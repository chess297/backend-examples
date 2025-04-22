import { ApiProperty } from '@nestjs/swagger';

export class PresignedUrlResponseDto {
  @ApiProperty({ description: '预签名上传 URL' })
  url: string;

  @ApiProperty({ description: '上传表单中需要包含的字段' })
  formData: Record<string, string>;

  @ApiProperty({ description: '文件 key（用于后续查询文件）' })
  key: string;

  @ApiProperty({ description: '过期时间（秒）' })
  expiresIn: number;
}
