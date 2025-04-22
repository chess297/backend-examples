import * as fs from 'fs';
import { diskStorage } from 'multer';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { AttachmentController } from './attachment.controller';
import { AttachmentService } from './attachment.service';

@Module({
  imports: [
    ConfigModule, // 导入ConfigModule使其可被控制器使用
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const uploadDir = configService.get<string>('UPLOAD_DIR', 'uploads');

        // 确保上传目录存在
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        return {
          storage: diskStorage({
            destination: uploadDir,
            filename: (req, file, callback) => {
              const uniqueSuffix = uuidv4();
              const ext = path.extname(file.originalname);
              callback(null, `${uniqueSuffix}${ext}`);
            },
          }),
          limits: {
            fileSize: 10 * 1024 * 1024, // 10 MB
          },
        };
      },
    }),
  ],
  controllers: [AttachmentController],
  providers: [AttachmentService],
  exports: [AttachmentService],
})
export class AttachmentModule {}
