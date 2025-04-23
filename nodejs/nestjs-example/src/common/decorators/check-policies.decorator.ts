import { PermissionAction, Prisma } from '@prisma/client';
import { SetMetadata } from '@nestjs/common';

export interface PolicyHandler {
  action: PermissionAction;
  subject: Prisma.ModelName;
  // 可以添加其他策略相关属性
}

export const CHECK_POLICIES_KEY = 'check_policies';

/**
 * 检查策略装饰器 - 用于控制器方法，定义访问该方法所需的策略
 * @param handlers 策略处理器数组
 * @returns 装饰器
 *
 * 使用示例:
 *
 * @CheckPolicies({ action: PermissionAction.read, subject: Prisma.ModelName.User })
 * @Get('users')
 * findAll() { ... }
 */
export const CheckPolicies = (...handlers: PolicyHandler[]) =>
  SetMetadata(CHECK_POLICIES_KEY, handlers);

/**
 * 便捷装饰器 - 检查创建权限
 * @param subject 资源类型
 */
export const CheckCreate = (subject: Prisma.ModelName) =>
  CheckPolicies({ action: PermissionAction.create, subject });

/**
 * 便捷装饰器 - 检查读取权限
 * @param subject 资源类型
 */
export const CheckRead = (subject: Prisma.ModelName) =>
  CheckPolicies({ action: PermissionAction.read, subject });

/**
 * 便捷装饰器 - 检查更新权限
 * @param subject 资源类型
 */
export const CheckUpdate = (subject: Prisma.ModelName) =>
  CheckPolicies({ action: PermissionAction.update, subject });

/**
 * 便捷装饰器 - 检查删除权限
 * @param subject 资源类型
 */
export const CheckDelete = (subject: Prisma.ModelName) =>
  CheckPolicies({ action: PermissionAction.delete, subject });

/**
 * 便捷装饰器 - 检查管理权限
 * @param subject 资源类型
 */
export const CheckManage = (subject: Prisma.ModelName) =>
  CheckPolicies({ action: PermissionAction.manage, subject });
