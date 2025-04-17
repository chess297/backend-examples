import { Response } from 'express';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';

// 过滤Http异常
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
    const details: string[] = [];
    const responseBody = exception.getResponse();

    if (typeof responseBody === 'object' && responseBody !== null) {
      if ('message' in responseBody && Array.isArray(responseBody.message)) {
        const message = responseBody.message;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        details.push(...message);
      }
    }
    // 自定义异常返回体
    response.status(statusCode).json({
      message: exception.message,
      code: statusCode,
      timestamp: new Date().toISOString(),
      details,
    });
  }
}
