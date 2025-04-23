import { PrismaQuery, accessibleBy } from '@casl/prisma';
import { PermissionAction, Prisma } from '@prisma/client';
import { Request } from 'express';
import { Injectable, Scope, ForbiddenException, Logger } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { CaslAbilityFactory } from './casl-ability.factory';
import {
  AppAbility,
  AppSubjects,
  CaslUser,
  SessionUser,
} from './interfaces/ability.interface';

@Injectable({ scope: Scope.REQUEST })
export class CaslHelperService {
  private _ability: AppAbility | null = null;
  private readonly logger = new Logger(CaslHelperService.name);

  constructor(
    @Inject(REQUEST) private readonly request: Request,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  /**
   * 获取当前用户的能力实例
   */
  getAbility(): AppAbility {
    if (!this._ability) {
      if (!this.request.session?.user) {
        this.logger.warn('No user found in session, creating empty ability');
        // 返回空能力实例
        this._ability = this.caslAbilityFactory.createForUser({
          id: 'anonymous',
        });
      } else {
        // 将会话用户转换为 CASL 用户格式
        const caslUser = this.sessionUserToCaslUser(this.request.session.user);
        this._ability = this.caslAbilityFactory.createForUser(caslUser);
      }
    }
    return this._ability;
  }

  /**
   * 将会话中的用户转换为 CASL 用户格式
   * @param sessionUser 会话用户
   * @returns CASL 用户
   */
  private sessionUserToCaslUser(sessionUser: SessionUser): CaslUser {
    const permissions: CaslUser['permissions'] = [];

    // 如果存在权限映射，转换为 CASL 格式
    if (sessionUser.permissions) {
      Object.entries(sessionUser.permissions).forEach(([resource, actions]) => {
        if (Array.isArray(actions)) {
          permissions.push({
            resource,
            actions,
          });
        }
      });
    }

    return {
      id: sessionUser.id,
      is_admin: sessionUser.is_admin,
      permissions,
    };
  }

  /**
   * 检查用户是否有特定操作的权限
   * @param action 操作类型
   * @param subject 资源类型或实例
   * @returns 是否有权限
   */
  can(action: PermissionAction, subject: AppSubjects): boolean {
    const ability = this.getAbility();
    return ability.can(action, subject);
  }

  /**
   * 检查用户是否没有特定操作的权限
   * @param action 操作类型
   * @param subject 资源类型或实例
   * @returns 是否没有权限
   */
  cannot(action: PermissionAction, subject: AppSubjects): boolean {
    const ability = this.getAbility();
    return ability.cannot(action, subject);
  }

  /**
   * 检查权限并在无权限时抛出异常
   * @param action 操作类型
   * @param subject 资源类型或实例
   * @param message 错误消息
   */
  throwUnlessAuthorized(
    action: PermissionAction,
    subject: AppSubjects,
    message = '您没有权限执行此操作',
  ): void {
    if (this.cannot(action, subject)) {
      this.logger.warn(
        `Authorization failed: ${action} on ${typeof subject === 'string' ? subject : JSON.stringify(subject)}`,
      );
      throw new ForbiddenException(message);
    }
  }

  /**
   * 获取基于权限的 Prisma 查询条件
   * @param action 操作类型
   * @param modelName Prisma 模型名称
   * @returns Prisma 查询条件
   */
  getPrismaWhere(
    action: PermissionAction,
    modelName: Prisma.ModelName,
  ): PrismaQuery {
    const ability = this.getAbility();

    // 使用 @casl/prisma 提供的 accessibleBy 方法生成查询条件
    return accessibleBy(ability, action)[modelName];
  }

  /**
   * 应用权限过滤器到 Prisma 查询参数
   * @param action 操作类型
   * @param modelName Prisma 模型名称
   * @param baseParams 基础查询参数
   * @returns 应用了权限过滤器的查询参数
   */
  applyPrismaFilter(
    action: PermissionAction,
    modelName: Prisma.ModelName,
    baseParams: Record<string, any> = {},
  ): Record<string, any> {
    const accessibleWhere = this.getPrismaWhere(action, modelName);

    // 如果没有权限条件，直接返回原始参数
    if (!accessibleWhere || Object.keys(accessibleWhere).length === 0) {
      return baseParams;
    }

    // 合并权限条件和基础查询参数
    const result = { ...baseParams };

    if (!result.where) {
      result.where = accessibleWhere;
    } else {
      // 如果已经有 where 条件，使用 AND 组合
      result.where = {
        AND: [result.where, accessibleWhere],
      };
    }

    return result;
  }
}
