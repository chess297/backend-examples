import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import reqId from 'request-ip';
// 过滤所有的异常
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    // 获取上下文
    const ctx = host.switchToHttp();
    // 获取响应体
    const response = ctx.getResponse<Response>();
    // 获取状态码，判断是HTTP异常还是服务器异常
    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const req = ctx.getRequest<reqId.Request>();
    let ip: string | null = null;
    if (req) {
      ip = reqId.getClientIp(req);
    }

    // 自定义异常返回体
    response.status(statusCode).json({
      // responseMessage(null, '服务器内部错误!', statusCode)
      message: '服务器内部错误!',
      statusCode,
      timestamp: new Date().toISOString(),
      ip,
    });
  }
}
