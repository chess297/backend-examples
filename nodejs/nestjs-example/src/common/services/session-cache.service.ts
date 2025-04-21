import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PermissionEntity } from '@/access/permission/entities/permission.entity';
import { RoleEntity } from '@/access/role/entities/role.entity';
import { UserEntity } from '@/access/user/entities/user.entity';
import { APP_NAME } from '@/constants';

@Injectable()
export class SessionCacheService {
  private readonly logger = new Logger(SessionCacheService.name);
  private readonly sessionPrefix: string;
  private readonly sessionMaxAge: number; // 单位: 秒

  constructor(
    @InjectRedis() private readonly redis: Redis,
    private readonly configService: ConfigService,
  ) {
    this.sessionPrefix = `${APP_NAME}:`;
    // 默认7天过期，可以从配置中读取
    this.sessionMaxAge = this.configService.get<number>(
      'session.maxAge',
      7 * 24 * 60 * 60,
    );
  }

  /**
   * 更新用户权限缓存
   * @param userId 用户ID
   * @param permissions 权限列表
   * @param roles 角色列表
   */
  async updateUserSessionCache(
    userId: string,
    permissions?: PermissionEntity[],
    roles?: RoleEntity[],
  ): Promise<boolean> {
    try {
      // 1. 获取用户的所有会话ID
      const sessionIds = await this.findUserSessionIds(userId);

      if (!sessionIds || sessionIds.length === 0) {
        this.logger.debug(`用户 ${userId} 没有活跃会话`);
        return false;
      }

      // 2. 为每个会话更新权限信息
      for (const sessionId of sessionIds) {
        await this.updateSessionPermissions(
          sessionId,
          userId,
          permissions,
          roles,
        );

        // 同时刷新会话TTL
        await this.refreshSessionTTL(sessionId, userId);
      }

      return true;
    } catch (error) {
      this.logger.error(`更新用户 ${userId} 会话缓存失败:`, error);
      return false;
    }
  }

  /**
   * 刷新会话TTL
   * @param sessionKey 会话键名
   * @param userId 用户ID
   * @returns 是否成功刷新
   */
  async refreshSessionTTL(
    sessionKey: string,
    userId: string,
  ): Promise<boolean> {
    try {
      // 检查会话是否存在
      const exists = await this.redis.exists(sessionKey);
      if (!exists) {
        return false;
      }

      // 更新会话TTL
      await this.redis.expire(sessionKey, this.sessionMaxAge);

      this.logger.debug(`已更新用户 ${userId} 的会话TTL`);
      return true;
    } catch (error) {
      this.logger.error(`更新会话TTL失败:`, error);
      return false;
    }
  }

  /**
   * 刷新指定用户的所有会话TTL
   * @param userId 用户ID
   * @returns 成功刷新的会话数量
   */
  async refreshUserSessionsTTL(userId: string): Promise<number> {
    try {
      // 1. 获取用户的所有会话ID
      const sessionIds = await this.findUserSessionIds(userId);

      if (!sessionIds || sessionIds.length === 0) {
        this.logger.debug(`用户 ${userId} 没有活跃会话`);
        return 0;
      }

      // 2. 为每个会话延长TTL
      let successCount = 0;
      for (const sessionId of sessionIds) {
        const success = await this.refreshSessionTTL(sessionId, userId);
        if (success) successCount++;
      }

      return successCount;
    } catch (error) {
      this.logger.error(`刷新用户 ${userId} 所有会话TTL失败:`, error);
      return 0;
    }
  }

  /**
   * 查找用户的所有会话ID
   */
  private async findUserSessionIds(userId: string): Promise<string[]> {
    try {
      // 获取所有会话keys
      const sessionKeys = await this.redis.keys(`${this.sessionPrefix}*`);
      const sessionIds: string[] = [];

      for (const key of sessionKeys) {
        const sessionData = await this.redis.get(key);
        if (!sessionData) continue;

        try {
          // 解析会话数据 (express-session 在Redis中存储为JSON字符串)
          const sessionDataParsed = JSON.parse(sessionData) as {
            passport?: { user?: { id?: string } };
          };
          const session: { passport?: { user?: { id?: string } } } =
            sessionDataParsed;

          // 检查session中是否有passport对象且包含指定用户
          if (session?.passport?.user?.id === userId) {
            // 提取会话ID
            sessionIds.push(key);
          }
        } catch (e) {
          if (e instanceof Error) {
            this.logger.warn(`解析会话数据失败: ${e.message}`);
          } else {
            this.logger.warn(`解析会话数据失败: 未知错误`);
          }
        }
      }

      return sessionIds;
    } catch (error) {
      this.logger.error(`查找用户会话ID失败:`, error);
      return [];
    }
  }

  /**
   * 更新单个会话的权限信息
   */
  private async updateSessionPermissions(
    sessionKey: string,
    userId: string,
    permissions?: PermissionEntity[],
    roles?: RoleEntity[],
  ): Promise<void> {
    try {
      // 获取会话数据
      const sessionData = await this.redis.get(sessionKey);
      if (!sessionData) return;

      // 解析会话数据
      const session = JSON.parse(sessionData) as {
        passport?: {
          user?: { id?: string };
          permissions?: string[];
          is_admin?: boolean;
        };
      };

      if (!session.passport) return;

      // 计算新的权限字符串列表
      if (permissions && permissions.length > 0) {
        const permissionStrings = permissions.reduce((acc, permission) => {
          const actions = permission.actions.map(
            (action) => `${permission.resource}:${action}`,
          );
          return [...acc, ...actions];
        }, []);

        // 更新权限
        session.passport.permissions = permissionStrings;
      }

      // 更新是否为管理员的标记
      if (roles && roles.length > 0) {
        const is_admin = roles.some((role) => role.name === 'system-admin');
        session.passport.is_admin = is_admin;
      }

      // 保存更新后的会话数据回Redis
      const ttl = await this.redis.ttl(sessionKey);
      await this.redis.setex(
        sessionKey,
        ttl > 0 ? ttl : this.sessionMaxAge,
        JSON.stringify(session),
      );

      this.logger.debug(`已更新用户 ${userId} 的会话权限缓存`);
    } catch (error) {
      this.logger.error(`更新会话权限失败:`, error);
    }
  }
}
