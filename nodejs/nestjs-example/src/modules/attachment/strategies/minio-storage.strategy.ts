import { StorageType } from '@prisma/client';
import { Client } from 'minio';
import * as path from 'path';
import { v4 as uuid } from 'uuid';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PresignedUrlResponseDto } from '../dto/presigned-url-response.dto';
import { StorageStrategy } from './storage.strategy';

@Injectable()
export class MinioStorageStrategy implements StorageStrategy {
  private readonly client: Client;
  private readonly bucketName: string;
  private readonly logger = new Logger(MinioStorageStrategy.name);
  private readonly endpoint: string;
  private readonly port: number;
  private readonly useSSL: boolean;

  constructor(private configService: ConfigService) {
    // 从配置中获取 MinIO 信息
    this.endpoint = this.configService.get<string>(
      'minio.endpoint',
      'localhost',
    );
    this.port = this.configService.get<number>('minio.port', 9000);
    const accessKey = this.configService.get<string>('minio.access_key', '');
    const secretKey = this.configService.get<string>('minio.secret_key', '');
    this.useSSL = this.configService.get<boolean>('minio.use_ssl', false);
    this.bucketName = this.configService.get<string>(
      'minio.bucket_name',
      'nestjs-example',
    );

    // 创建 MinIO 客户端
    this.client = new Client({
      endPoint: this.endpoint,
      port: this.port,
      useSSL: this.useSSL,
      accessKey,
      secretKey,
    });

    // 确保 bucket 存在
    this.initBucket().catch((error: Error) => {
      this.logger.error(
        `初始化 MinIO bucket 失败: ${error.message}`,
        error.stack,
      );
    });
  }

  /**
   * 初始化 bucket，如果不存在则创建
   */
  private async initBucket(): Promise<void> {
    try {
      const exists = await this.client.bucketExists(this.bucketName);
      if (!exists) {
        await this.client.makeBucket(this.bucketName);
        this.logger.log(`已创建 MinIO bucket: ${this.bucketName}`);
      } else {
        this.logger.log(`MinIO bucket 已存在: ${this.bucketName}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(`检查或创建 bucket 失败: ${error.message}`);
      } else {
        this.logger.error('检查或创建 bucket 失败: 未知错误');
      }
      throw error;
    }
  }

  /**
   * 上传文件到 MinIO
   * @param file 上传的文件
   */
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
    try {
      // 生成唯一文件名
      const filename = `${uuid()}${path.extname(file.originalname)}`;

      // 上传文件到 MinIO
      await this.client.putObject(
        this.bucketName,
        filename,
        file.buffer,
        file.size,
        { 'Content-Type': file.mimetype },
      );

      this.logger.log(`文件上传成功到 MinIO: ${filename}`);

      // 生成访问URL
      const url = this.getFileUrl(filename);

      return {
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        path: filename, // 在 MinIO 中使用文件名作为路径
        url,
        storageType: StorageType.CLOUD,
      };
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(
          `上传文件到 MinIO 失败: ${error.message}`,
          error.stack,
        );
      } else {
        this.logger.error('上传文件到 MinIO 失败: 未知错误');
      }
      throw error;
    }
  }

  /**
   * 生成预签名上传 URL
   * @param filename 原始文件名
   * @param contentType 文件类型
   * @param expiryInSeconds 过期时间（秒）
   */
  async generatePresignedUrl(
    filename: string,
    contentType: string,
    expiryInSeconds: number = 300,
  ): Promise<PresignedUrlResponseDto> {
    try {
      // 生成唯一的文件名作为 key
      const ext = path.extname(filename);
      const fileKey = `${uuid()}${ext}`;

      // 设置策略
      const policy = this.client.newPostPolicy();
      policy.setBucket(this.bucketName);
      policy.setKey(fileKey);
      policy.setExpires(new Date(Date.now() + expiryInSeconds * 1000));
      policy.setContentType(contentType);

      // 生成预签名 URL
      const presignedData = await this.client.presignedPostPolicy(policy);

      const protocol = this.useSSL ? 'https' : 'http';
      const baseUrl = `${protocol}://${this.endpoint}:${this.port}`;

      return {
        url: presignedData.postURL,
        formData: presignedData.formData,
        key: fileKey,
        expiresIn: expiryInSeconds,
      };
    } catch (error) {
      this.logger.error(`生成预签名 URL 失败: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * 获取对象的公共访问 URL
   * @param key 对象的 key
   */
  getPublicUrl(key: string): string {
    const protocol = this.useSSL ? 'https' : 'http';
    return `${protocol}://${this.endpoint}:${this.port}/${this.bucketName}/${key}`;
  }

  /**
   * 获取文件的访问 URL
   * @param filename 文件名
   */
  getFileUrl(filename: string): string {
    const protocol = this.useSSL ? 'https' : 'http';
    return `${protocol}://${this.endpoint}:${this.port}/${this.bucketName}/${filename}`;
  }
}
