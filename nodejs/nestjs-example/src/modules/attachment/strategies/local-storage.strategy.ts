import { StorageType } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StorageStrategy } from './storage.strategy';

@Injectable()
export class LocalStorageStrategy implements StorageStrategy {
  private readonly uploadDir: string;
  private readonly baseUrl: string;
  private readonly logger = new Logger(LocalStorageStrategy.name);

  constructor(private configService: ConfigService) {
    this.uploadDir = this.configService.get<string>('upload_dir', 'uploads');
    this.baseUrl = 'http://localhost:3001';

    // 确保上传目录存在
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
      this.logger.log(`创建上传目录: ${this.uploadDir}`);
    }
  }

  async upload(file: Express.Multer.File): Promise<
    Partial<{
      id: string;
      originalName: string;
      mimeType: string;
      size: number;
      path: string;
      url: string;
      storageType: StorageType;
      create_at: Date;
      update_at: Date;
      delete_at: Date | null;
    }>
  > {
    // 确保文件确实已保存
    const uploadPath = file.path ?? file.originalname;
    if (!fs.existsSync(uploadPath)) {
      this.logger.warn(`文件未保存到正确路径: ${uploadPath}`);

      // 如果文件不存在，我们需要保存它
      const targetPath = path.join(this.uploadDir, path.basename(uploadPath));
      await fs.promises.writeFile(targetPath, file.buffer);
      file.path = targetPath;
      this.logger.log(`保存文件到: ${targetPath}`);
    } else {
      this.logger.log(`文件已存在于: ${file.path}`);
    }

    return {
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      path: file.path,
      url: this.getFileUrl(path.basename(file.path)),
      storageType: StorageType.LOCAL,
    };
  }

  getFileUrl(filePath: string): string {
    return `${this.baseUrl}/uploads/${filePath}`;
  }
}
