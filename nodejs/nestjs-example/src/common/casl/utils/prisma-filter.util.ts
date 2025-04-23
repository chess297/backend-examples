import { PrismaQuery, accessibleBy } from '@casl/prisma';
import {
  AppAbility,
  Action,
  EntityType,
} from '../interfaces/ability.interface';

/**
 * 为 Prisma 查询应用权限过滤
 * @param ability 用户权限能力实例
 * @param action 操作类型
 * @param entityType 实体类型
 * @param baseParams 基础查询参数
 * @returns 添加了权限过滤的查询参数
 */
export function applyPrismaFilter(
  ability: AppAbility,
  action: Action,
  entityType: EntityType,
  baseParams: Record<string, any> = {},
): Record<string, any> {
  // 获取权限过滤条件
  const accessibleWhere = accessibleBy(ability, action)[entityType];

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

/**
 * 创建基于权限的 Prisma 查询参数构建器
 * @param ability 用户权限能力实例
 * @param action 操作类型
 * @param entityType 实体类型
 */
export function createPrismaFilterBuilder(
  ability: AppAbility,
  action: Action,
  entityType: EntityType,
) {
  return {
    /**
     * 添加一个基本 where 条件
     * @param where 基本条件
     */
    where(where: Record<string, any>) {
      return applyPrismaFilter(ability, action, entityType, { where });
    },

    /**
     * 添加排序条件
     * @param orderBy 排序条件
     */
    orderBy(orderBy: Record<string, any>) {
      const params = applyPrismaFilter(ability, action, entityType, {});
      return { ...params, orderBy };
    },

    /**
     * 添加分页条件
     * @param skip 跳过记录数
     * @param take 获取记录数
     */
    paginate(skip: number, take: number) {
      const params = applyPrismaFilter(ability, action, entityType, {});
      return { ...params, skip, take };
    },

    /**
     * 构建完整的查询参数
     * @param baseParams 基础参数
     */
    build(baseParams: Record<string, any> = {}) {
      return applyPrismaFilter(ability, action, entityType, baseParams);
    },
  };
}
