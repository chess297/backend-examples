import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SystemInitService } from '@/system-init/system-init.service';

/**
 * 系统初始化守卫
 * 用于检查系统是否已初始化，如果未初始化，则返回特定状态码和信息以便前端跳转到初始化页面
 */
@Injectable()
export class SystemInitGuard implements CanActivate {
  private readonly logger = new Logger(SystemInitGuard.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly systemInitService: SystemInitService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 获取请求对象
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    // 检查当前路径是否是系统初始化相关的路径
    // 如果是系统初始化相关的路径，则不需要检查系统是否初始化
    const path = request.path;
    if (
      path === '/health' ||
      path.startsWith('/api/v1/system-init') ||
      path.startsWith('/api/v1/menu')
    ) {
      return true;
    }

    try {
      // 检查系统是否已初始化
      const isInitialized = await this.systemInitService.isSystemInitialized();

      if (isInitialized) {
        // 系统已初始化，允许访问
        return true;
      } else {
        // 系统未初始化，返回特定状态码和消息
        response.status(503).json({
          statusCode: 503, // 使用服务不可用状态码
          initialized: false,
          message: 'System not initialized',
          redirectTo: '/auth/system-init', // 前端需要处理这个字段进行跳转
        });
        return false;
      }
    } catch (error) {
      this.logger.error(`检查系统初始化状态时出错: ${error.message}`);
      // 发生错误时，默认允许访问
      return true;
    }
  }
}
