import { Request } from 'express';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import {
  Action,
  AppAbility,
  AppSubjects,
  CaslUser,
  SessionUser,
} from '../casl/interfaces/ability.interface';
import {
  CHECK_POLICIES_KEY,
  PolicyHandler,
} from '../decorators/check-policies.decorator';

@Injectable()
export class PoliciesGuard implements CanActivate {
  private readonly logger = new Logger(PoliciesGuard.name);

  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    try {
      const policyHandlers =
        this.reflector.get<PolicyHandler[]>(
          CHECK_POLICIES_KEY,
          context.getHandler(),
        ) || [];
      const policyClassHandlers =
        this.reflector.get<PolicyHandler[]>(
          CHECK_POLICIES_KEY,
          context.getClass(),
        ) || [];
      const allPolicyHandlers = [...policyHandlers, ...policyClassHandlers];

      // 如果没有定义策略，默认允许访问
      if (allPolicyHandlers.length === 0) {
        return true;
      }

      const request = context.switchToHttp().getRequest<Request>();
      const { session } = request;

      if (!session?.user) {
        this.logger.warn('User not found in session, access denied');
        return false;
      }

      // 将会话用户转换为 CASL 用户
      const caslUser = this.convertSessionUser(session.user);

      // 创建用户能力实例
      const ability = this.caslAbilityFactory.createForUser(caslUser);

      // 检查所有策略
      return allPolicyHandlers.every((handler) =>
        this.checkPolicy(ability, handler),
      );
    } catch (error: unknown) {
      // 安全地处理错误
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`Policy check failed: ${errorMessage}`, errorStack);
      return false;
    }
  }

  /**
   * 将会话用户转换为 CASL 用户 - 使用同步方法而不是不必要的异步
   */
  private convertSessionUser(sessionUser: SessionUser): CaslUser {
    const permissions: CaslUser['permissions'] = [];

    // 如果存在权限映射，转换为 CASL 格式
    if (sessionUser.permissions) {
      Object.keys(sessionUser.permissions).forEach((resource) => {
        const actions = sessionUser.permissions?.[resource] ?? [];
        permissions.push({
          resource,
          actions,
        });
      });
    }

    return {
      id: sessionUser.id,
      is_admin: sessionUser.is_admin,
      permissions,
    };
  }

  /**
   * 检查单个策略
   */
  private checkPolicy(ability: AppAbility, handler: PolicyHandler): boolean {
    const { action, subject } = handler;

    // 检查用户是否有权限 - 移除不必要的类型断言
    if (!ability.can(action, subject as AppSubjects)) {
      this.logger.warn(`Access denied: ${action} on ${subject}`);
      return false;
    }

    return true;
  }
}
