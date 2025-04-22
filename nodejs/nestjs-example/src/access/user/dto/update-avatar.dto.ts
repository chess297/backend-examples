import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAvatarRequest {
  @ApiProperty({
    description: '上传的文件',
    type: 'string',
    format: 'binary',
  })
  file: Express.Multer.File;
}

export class UpdateAvatarResponse {
  @ApiProperty({ description: '用户ID' })
  id: string;

  @ApiProperty({ description: '用户名' })
  username: string;

  @ApiProperty({ description: '头像URL' })
  avatar_url: string;
}
