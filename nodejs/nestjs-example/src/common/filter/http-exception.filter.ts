import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

import { responseMessage } from '@/utils';

@Catch(HttpException)
export class HttpExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionsFilter.name);
  catch(exception: HttpException, host: ArgumentsHost) {
    // 获取上下文
    const ctx = host.switchToHttp();
    // 获取响应体
    const response = ctx.getResponse<Response>();
    // 获取状态码
    const statusCode = exception.getStatus();
    // const responseBody = exception.getResponse();
    // 自定义异常返回体
    this.logger.error(`${exception.message}`, exception.stack);
    response
      .status(statusCode)
      .json(responseMessage(undefined, exception.message, statusCode));
  }
}
