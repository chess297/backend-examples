import { StorageType } from '@prisma/client';
import { v4 as uuid } from 'uuid';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../database/prisma/prisma.service';
import { PresignedUrlResponseDto } from './dto/presigned-url-response.dto';
import { LocalStorageStrategy } from './strategies/local-storage.strategy';
import { MinioStorageStrategy } from './strategies/minio-storage.strategy';
import { StorageStrategy } from './strategies/storage.strategy';

@Injectable()
export class AttachmentService {
  private strategies: Record<StorageType, StorageStrategy>;
  private minioStrategy: MinioStorageStrategy;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    // 初始化存储策略
    this.minioStrategy = new MinioStorageStrategy(configService);
    this.strategies = {
      [StorageType.LOCAL]: new LocalStorageStrategy(configService),
      [StorageType.CLOUD]: this.minioStrategy,
    };
  }

  /**
   * 上传文件
   * @param file 上传的文件
   * @param storageType 存储类型
   */
  async uploadFile(
    file: Express.Multer.File,
    storageType: StorageType = StorageType.CLOUD,
  ) {
    const strategy = this.strategies[storageType];
    const attachmentData = await strategy.upload(file);
    if (!attachmentData || !attachmentData.path) {
      throw new NotFoundException(`文件上传失败`);
    }

    // 保存附件记录到数据库
    return this.prisma.attachment.create({
      data: {
        ...attachmentData,
        path:
          storageType === StorageType.LOCAL ? file.path : attachmentData.path,
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

  /**
   * 获取预签名上传 URL
   * @param filename 文件名
   * @param contentType 内容类型
   * @param expiry 过期时间（秒）
   * @returns 预签名 URL 和表单数据
   */
  async getPresignedUploadUrl(
    filename: string,
    contentType: string,
    expiry: number = 300,
  ): Promise<PresignedUrlResponseDto> {
    return this.minioStrategy.generatePresignedUrl(
      filename,
      contentType,
      expiry,
    );
  }

  /**
   * 完成预签名上传，将文件信息记录到数据库
   * @param key 文件 key
   * @param originalName 原始文件名
   * @param contentType 内容类型
   * @param size 文件大小
   */
  async completePresignedUpload(
    key: string,
    originalName: string,
    contentType: string,
    size: number,
  ) {
    const url = this.minioStrategy.getPublicUrl(key);

    return this.prisma.attachment.create({
      data: {
        id: uuid(),
        originalName,
        mimeType: contentType,
        size,
        path: key,
        url,
        storageType: StorageType.CLOUD,
        delete_at: null,
      },
    });
  }
}
