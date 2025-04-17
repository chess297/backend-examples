import { Response } from 'express';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

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
    let message = '服务器内部错误';
    if (exception && exception['message']) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      message = (exception as any).message;
    }

    // 自定义异常返回体
    response.status(statusCode).json({
      message,
      code: statusCode,
      timestamp: new Date().toISOString(),
    });
  }
}
