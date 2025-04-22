import { StorageType } from '@prisma/client';
import { v4 as uuid } from 'uuid';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../database/prisma/prisma.service';
import { LocalStorageStrategy } from './strategies/local-storage.strategy';
import { StorageStrategy } from './strategies/storage.strategy';

@Injectable()
export class AttachmentService {
  private strategies: Record<StorageType, StorageStrategy>;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    // 初始化存储策略
    this.strategies = {
      [StorageType.LOCAL]: new LocalStorageStrategy(configService),
      [StorageType.CLOUD]: new LocalStorageStrategy(configService),
      // 如果未来添加云存储策略，可以在这里添加：
      // [StorageType.CLOUD]: new CloudStorageStrategy(configService),
    };
  }

  /**
   * 上传文件
   * @param file 上传的文件
   * @param storageType 存储类型
   */
  async uploadFile(
    file: Express.Multer.File,
    storageType: StorageType = StorageType.LOCAL,
  ) {
    const strategy = this.strategies[storageType];
    const attachmentData = await strategy.upload(file);

    // 保存附件记录到数据库
    return this.prisma.attachment.create({
      data: {
        ...attachmentData,
        path: file.path,
        storageType,
        delete_at: null,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        url: attachmentData.url ?? '',
        id: uuid(),
      },
    });
  }

  /**
   * 获取附件信息
   * @param id 附件ID
   */
  async getAttachment(id: string) {
    const attachment = await this.prisma.attachment.findUnique({
      where: { id },
    });

    if (!attachment) {
      throw new NotFoundException(`附件ID ${id} 不存在`);
    }

    return attachment;
  }

  /**
   * 通过文件名获取附件
   * @param filename 文件名
   */
  async getAttachmentByFilename(filename: string) {
    const attachment = await this.prisma.attachment.findFirst({
      where: {
        path: {
          contains: filename,
        },
        delete_at: null,
      },
    });

    if (!attachment) {
      throw new NotFoundException(`附件 ${filename} 不存在`);
    }

    return attachment;
  }
}
