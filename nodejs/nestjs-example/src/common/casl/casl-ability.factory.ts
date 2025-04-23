import { AbilityBuilder } from '@casl/ability';
import { PermissionAction, Prisma } from '@prisma/client';
import { Injectable, Logger } from '@nestjs/common';
import {
  AppAbility,
  AppSubjects,
  CaslUser,
  ModelAlias,
  createAppAbility,
} from './interfaces/ability.interface';

@Injectable()
export class CaslAbilityFactory {
  private readonly logger = new Logger(CaslAbilityFactory.name);

  /**
   * 为用户创建能力实例
   * @param user 用户信息，包含权限
   * @returns AppAbility 实例
   */
  createForUser(user: CaslUser): AppAbility {
    const { can, cannot, build } = new AbilityBuilder(createAppAbility);

    if (user.is_admin) {
      // 管理员可以做任何事
      can(PermissionAction.manage, 'all');
      this.logger.debug(`Admin user ${user.id} granted full access`);
      return build();
    }

    if (!user.permissions || user.permissions.length === 0) {
      this.logger.debug(`User ${user.id} has no permissions`);
      return build();
    }

    // 处理用户权限
    this.processUserPermissions(user.permissions, can);

    return build();
  }

  /**
   * 处理用户的权限列表
   */
  private processUserPermissions(
    permissions: NonNullable<CaslUser['permissions']>,
    can: AbilityBuilder<AppAbility>['can'],
  ): void {
    for (const permission of permissions) {
      const { resource, actions, conditions } = permission;

      // 处理所有动作
      for (const action of actions) {
        // 处理特殊的 'all' 资源
        if (resource.toLowerCase() === 'all') {
          can(action, 'all');
          continue;
        }

        // 将资源名映射到 Prisma 实体
        const subject = this.mapResourceToSubject(resource);
        if (!subject) {
          this.logger.warn(`Unknown resource: ${resource}`);
          continue;
        }

        // 应用权限规则，包括可选的条件
        if (conditions) {
          // 使用类型断言解决类型不兼容问题
          can(action, subject as any, conditions);
          this.logger.debug(
            `Granted ${action} on ${typeof subject === 'string' ? subject : JSON.stringify(subject)} with conditions: ${JSON.stringify(conditions)}`,
          );
        } else {
          can(action, subject as any);
          this.logger.debug(
            `Granted ${action} on ${typeof subject === 'string' ? subject : JSON.stringify(subject)}`,
          );
        }
      }
    }
  }

  /**
   * 将资源字符串映射到 Prisma 模型名
   */
  private mapResourceToSubject(resource: string): AppSubjects | null {
    const normalizedResource = resource.toLowerCase();

    // 先尝试从别名映射中获取
    if (normalizedResource in ModelAlias) {
      return ModelAlias[normalizedResource] as AppSubjects;
    }

    // 尝试直接匹配 Prisma 模型名
    try {
      // 尝试将字符串首字母大写，适配 Prisma ModelName 格式
      const capitalizedResource =
        normalizedResource.charAt(0).toUpperCase() +
        normalizedResource.slice(1);

      // 检查是否为有效的 Prisma 模型名
      if (
        Object.values(Prisma.ModelName).includes(
          capitalizedResource as Prisma.ModelName,
        )
      ) {
        return capitalizedResource as AppSubjects;
      }
    } catch (error) {
      // 忽略错误，继续尝试其他匹配方式
    }

    // 特殊处理下划线和连字符风格的资源名
    if (normalizedResource.includes('-') || normalizedResource.includes('_')) {
      // 将 'menu-group' 或 'menu_group' 转换为 'MenuGroup'
      const modelName = normalizedResource
        .split(/[-_]/)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join('');

      // 检查是否为有效的 Prisma 模型名
      if (
        Object.values(Prisma.ModelName).includes(modelName as Prisma.ModelName)
      ) {
        return modelName as AppSubjects;
      }
    }

    return null;
  }
}
