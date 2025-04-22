import { Attachment } from '@prisma/client';

export interface StorageStrategy {
  /**
   * 上传文件
   * @param file 上传的文件
   */
  upload(file: Express.Multer.File): Promise<Partial<Attachment>>;

  /**
   * 获取文件的访问URL
   * @param path 文件路径
   */
  getFileUrl(path: string): string;
}
