import { InjectRedis } from '@nestjs-modules/ioredis';
import { Request } from 'express';
import Redis from 'ioredis';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { APP_NAME } from 'src/constants';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Session TTL更新拦截器
 * 作用: 延长活跃用户的会话过期时间
 */
@Injectable()
export class SessionTtlInterceptor implements NestInterceptor {
  private readonly logger = new Logger(SessionTtlInterceptor.name);
  private readonly sessionPrefix: string;
  private readonly sessionMaxAge: number; // 单位: 秒

  constructor(
    @InjectRedis() private readonly redis: Redis,
    private readonly configService: ConfigService,
  ) {
    this.sessionPrefix = `${APP_NAME}:`;
    // 默认7天过期，可从配置中读取
    this.sessionMaxAge = this.configService.get<number>(
      'session.maxAge',
      7 * 24 * 60 * 60,
    );
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap(() => {
        // 仅处理HTTP请求
        if (context.getType() !== 'http') return;

        const request = context.switchToHttp().getRequest<Request>();

        // 确认用户已登录且有会话ID
        if (request.session?.passport?.user?.id && request.sessionID) {
          this.refreshSessionTTL(
            request.sessionID,
            request.session.passport.user.id,
          );
        }
      }),
    );
  }

  /**
   * 刷新会话TTL
   * @param sessionId 会话ID
   * @param userId 用户ID
   */
  private async refreshSessionTTL(
    sessionId: string,
    userId: string,
  ): Promise<void> {
    try {
      const sessionKey = `${this.sessionPrefix}${sessionId}`;

      // 检查会话是否存在
      const exists = await this.redis.exists(sessionKey);
      if (!exists) {
        return;
      }

      // 更新会话TTL
      await this.redis.expire(sessionKey, this.sessionMaxAge);

      this.logger.debug(`已更新用户 ${userId} 的会话TTL`);
    } catch (error) {
      this.logger.error(`更新会话TTL失败:`, error);
    }
  }
}
