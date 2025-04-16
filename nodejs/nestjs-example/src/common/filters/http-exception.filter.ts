import { Response } from 'express';
import reqId from 'request-ip';
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
    const responseBody = exception.getResponse();

    const details: string[] = [];
    if (typeof responseBody === 'object' && responseBody !== null) {
      if ('message' in responseBody && Array.isArray(responseBody.message)) {
        const message = responseBody.message;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        details.push(...message);
      }
    }
    const req = ctx.getRequest<reqId.Request>();
    let ip: string | null = null;
    if (req) {
      ip = reqId.getClientIp(req);
    }
    // 自定义异常返回体
    response.status(statusCode).json({
      message: exception.message,
      statusCode,
      timestamp: new Date().toISOString(),
      ip,
      details,
    });
  }
}
