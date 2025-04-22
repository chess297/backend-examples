import { StorageType } from '@prisma/client';
import { Response } from 'express';
import * as fs from 'fs';
import {
  Controller,
  Get,
  Post,
  Param,
  UseInterceptors,
  UploadedFile,
  Res,
  Query,
  NotFoundException,
  Redirect,
  Logger,
  ParseEnumPipe,
  Body,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { APIOkResponse } from '@/common/decorators/swagger.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { AttachmentService } from './attachment.service';
import { CompleteUploadDto } from './dto/complete-upload.dto';
import { PresignedUrlRequestDto } from './dto/presigned-url-request.dto';
import { PresignedUrlResponseDto } from './dto/presigned-url-response.dto';
import { UploadResponseDto } from './dto/upload-response.dto';

@ApiTags('附件')
@Controller('attachment')
export class AttachmentController {
  private readonly logger = new Logger(AttachmentController.name);

  constructor(
    private readonly attachmentService: AttachmentService,
    private readonly configService: ConfigService,
  ) {}

  @Post('upload')
  @ApiOperation({ summary: '上传文件' })
  @ApiConsumes('multipart/form-data')
  @ApiQuery({
    name: 'storageType',
    enum: StorageType,
    required: false,
    description: '存储类型，LOCAL：本地存储，CLOUD：MinIO存储',
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Query('storageType') storageType: StorageType = StorageType.CLOUD,
  ): Promise<UploadResponseDto> {
    this.logger.log(
      `正在上传文件: ${file.originalname}, 大小: ${file.size} 字节, 存储类型: ${storageType}`,
    );

    const attachment = await this.attachmentService.uploadFile(
      file,
      storageType,
    );

    return {
      id: attachment.id,
      originalName: attachment.originalName,
      mimeType: attachment.mimeType,
      size: attachment.size,
      url: attachment.url,
      storageType: attachment.storageType,
    };
  }

  /**
   * 获取预签名上传 URL，用于前端直传
   */
  @Post('presigned-url')
  @ApiOperation({
    summary: '获取预签名上传 URL（前端直传）',
    operationId: 'getUploadUrl',
  })
  @APIOkResponse(PresignedUrlResponseDto)
  async getPresignedUrl(
    @Body() presignedUrlDto: PresignedUrlRequestDto,
  ): Promise<PresignedUrlResponseDto> {
    this.logger.log(`获取预签名上传 URL: ${presignedUrlDto.filename}`);
    return this.attachmentService.getPresignedUploadUrl(
      presignedUrlDto.filename,
      presignedUrlDto.contentType,
      presignedUrlDto.expiry,
    );
  }

  /**
   * 完成预签名上传，将文件信息记录到数据库
   */
  @Post('complete-upload')
  @ApiOperation({ summary: '完成预签名上传（前端直传完成后调用）' })
  async completeUpload(
    @Body() completeUploadDto: CompleteUploadDto,
  ): Promise<UploadResponseDto> {
    this.logger.log(`完成预签名上传: ${completeUploadDto.key}`);
    const attachment = await this.attachmentService.completePresignedUpload(
      completeUploadDto.key,
      completeUploadDto.originalName,
      completeUploadDto.contentType,
      completeUploadDto.size,
    );

    return {
      id: attachment.id,
      originalName: attachment.originalName,
      mimeType: attachment.mimeType,
      size: attachment.size,
      url: attachment.url,
      storageType: attachment.storageType,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: '通过ID获取附件信息' })
  async getAttachmentById(@Param('id') id: string) {
    return this.attachmentService.getAttachment(id);
  }

  @Get('file/:filename')
  @Public() // 允许公开访问文件
  @ApiOperation({ summary: '下载/查看文件（兼容旧接口）' })
  async serveFile(@Param('filename') filename: string, @Res() res: Response) {
    const attachment =
      await this.attachmentService.getAttachmentByFilename(filename);
    const baseUrl = this.configService.get<string>(
      'BASE_URL',
      'http://localhost:3000',
    );

    // 重定向到静态文件服务路径
    return res.redirect(`${baseUrl}/static/${filename}`);
  }
}
