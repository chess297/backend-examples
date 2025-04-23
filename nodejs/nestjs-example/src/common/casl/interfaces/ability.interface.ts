import { AbilityBuilder, AbilityClass, PureAbility } from '@casl/ability';
import { PrismaQuery, createPrismaAbility, Subjects } from '@casl/prisma';
import {
  Menu,
  MenuGroup,
  Permission,
  PermissionAction,
  Prisma,
  Role,
  Task,
  User,
} from '@prisma/client';

// 使用 Prisma 定义的 PermissionAction 代替自定义的 Action
export { PermissionAction as Action } from '@prisma/client';

// 使用 Prisma 的 ModelName 类型
export type PrismaModelName = Prisma.ModelName;

// 定义实体类型 - 与 Prisma.ModelName 保持一致
export type EntityType = Prisma.ModelName;

// 定义我们需要授权的 Prisma 模型映射
export const ModelAlias: Record<string, Prisma.ModelName> = {
  user: Prisma.ModelName.User,
  role: Prisma.ModelName.Role,
  permission: Prisma.ModelName.Permission,
  task: Prisma.ModelName.Task,
  menu: Prisma.ModelName.Menu,
  'menu-group': Prisma.ModelName.MenuGroup,
  // 可以添加其他别名映射
};

// 定义系统中可用的主体(Subject)
export type AppSubjects =
  | 'all'
  | Subjects<{
      User: User;
      Role: Role;
      Permission: Permission;
      Task: Task;
      Menu: Menu;
      MenuGroup: MenuGroup;
    }>;

// 定义我们系统的能力类型
export type AppAbility = PureAbility<
  [PermissionAction, AppSubjects],
  PrismaQuery
>;

// 创建 PrismaAbility 的工厂函数
export const createAppAbility =
  createPrismaAbility as unknown as AbilityClass<AppAbility>;

// 定义 CaslUser 接口
export interface CaslUser {
  id: string;
  is_admin?: boolean;
  permissions?: Array<{
    resource: string;
    actions: PermissionAction[];
    conditions?: Record<string, any>;
  }>;
}

// SessionUser 接口 - 表示会话中存储的用户
export interface SessionUser {
  id: string;
  is_admin?: boolean;
  permissions?: Record<string, PermissionAction[]>;
  [key: string]: any;
}
