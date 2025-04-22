import {
  Menu,
  MenuGroup,
  Permission,
  PermissionAction,
  PrismaClient,
  Role,
  User,
} from '@prisma/client';
import { ITXClientDenyList } from '@prisma/client/runtime/library';
import { v4 as uuid } from 'uuid';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/database/prisma/prisma.service';
import { DictionaryService } from '@/modules/dictionary/dictionary.service';
import {
  AdminRegisterRequest,
  AdminRegisterResponse,
} from './dto/admin-register.dto';

type TransactionPrismaClient = Omit<PrismaClient, ITXClientDenyList>;

@Injectable()
export class SystemInitService {
  private readonly logger = new Logger(SystemInitService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly dictionaryService: DictionaryService,
  ) {}

  /**
   * 生成系统初始化码
   * @returns 系统初始化码
   */
  async generateSystemCode(): Promise<string> {
    // 生成随机的系统码
    const code = this.generateRandomCode();

    // 设置过期时间为24小时后
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    // 存储系统码到数据库
    await this.prisma.systemCode.create({
      data: {
        id: uuid(),
        code,
        is_used: false,
        expires_at: expiresAt,
      },
    });

    return code;
  }

  /**
   * 验证系统码是否有效
   * @param code 系统码
   * @returns 系统码是否有效
   */
  async validateSystemCode(code: string): Promise<boolean> {
    const systemCode = await this.prisma.systemCode.findUnique({
      where: { code },
    });

    if (!systemCode) {
      return false;
    }

    if (systemCode.is_used) {
      return false;
    }

    if (systemCode.expires_at < new Date()) {
      return false;
    }

    return true;
  }

  /**
   * 使用系统码注册管理员账号并初始化系统
   * @param adminRegisterDto 管理员注册信息
   * @returns 注册结果
   */
  async registerAdmin(
    adminRegisterDto: AdminRegisterRequest,
  ): Promise<AdminRegisterResponse> {
    const { systemCode, ...adminData } = adminRegisterDto;

    // 验证系统码
    const isValid = await this.validateSystemCode(systemCode);
    if (!isValid) {
      throw new BadRequestException('系统码无效或已过期');
    }

    // 开始事务，确保所有操作都成功或都失败
    return this.prisma.$transaction(async (prisma: TransactionPrismaClient) => {
      // 1. 创建管理员用户
      const adminUser = await this.createAdminUser(adminData, prisma);

      // 2. 创建基础角色（系统管理员角色）
      const adminRole = await this.createAdminRole(prisma);

      // 3. 关联角色到用户
      await this.assignRoleToUser(adminUser.id, adminRole.id, prisma);

      // 4. 创建基础权限
      const permissions = await this.createBasePermissions(prisma);

      // 5. 关联权限到角色
      await this.assignPermissionsToRole(
        adminRole.id,
        permissions.map((p) => p.id),
        prisma,
      );

      // 6. 创建基础菜单和菜单组
      const { menuGroups, menus } = await this.createBaseMenuStructure(prisma);

      // 7. 创建系统字典
      await this.createSystemDictionaries(prisma, menuGroups);

      // 8. 标记系统码为已使用
      await this.markSystemCodeAsUsed(systemCode, prisma);

      return new AdminRegisterResponse();
    });
  }

  /**
   * 创建管理员账户
   */
  private async createAdminUser(
    adminData: Omit<AdminRegisterRequest, 'systemCode'>,
    prisma: TransactionPrismaClient,
  ): Promise<User> {
    const { username, email, password, phone, country_code, address } =
      adminData;

    // 检查用户是否已存在
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (existingUser) {
      throw new BadRequestException('用户名或邮箱已存在');
    }

    // 创建新用户
    const bcrypt = await import('bcrypt');
    const hashedPassword = await bcrypt.hash(password, 10);

    return prisma.user.create({
      data: {
        ...adminData,
        id: uuid(),
        password: hashedPassword,
        is_active: true,
      },
    });
  }

  /**
   * 创建管理员角色
   */
  private async createAdminRole(
    prisma: TransactionPrismaClient,
  ): Promise<Role> {
    return prisma.role.create({
      data: {
        id: uuid(),
        name: 'system-admin',
        description: '系统管理员',
      },
    });
  }

  /**
   * 关联角色到用户
   */
  private async assignRoleToUser(
    userId: string,
    roleId: string,
    prisma: TransactionPrismaClient,
  ): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: {
        roles: {
          connect: { id: roleId },
        },
      },
    });
  }

  /**
   * 创建基础权限
   */
  private async createBasePermissions(
    prisma: TransactionPrismaClient,
  ): Promise<Permission[]> {
    const permissions = [
      {
        id: uuid(),
        name: 'user-manage',
        description: '用户管理',
        resource: 'user',
        actions: [PermissionAction.manage],
      },
      {
        id: uuid(),
        name: 'role-manage',
        description: '角色管理',
        resource: 'role',
        actions: [PermissionAction.manage],
      },
      {
        id: uuid(),
        name: 'permission-manage',
        description: '权限管理',
        resource: 'permission',
        actions: [PermissionAction.manage],
      },
      {
        id: uuid(),
        name: 'menu-manage',
        description: '菜单管理',
        resource: 'menu',
        actions: [PermissionAction.manage],
      },
      {
        id: uuid(),
        name: 'menu-group-manage',
        description: '菜单组管理',
        resource: 'menu-group',
        actions: [PermissionAction.manage],
      },
    ];

    const createdPermissions: Permission[] = [];

    for (const permission of permissions) {
      const created = await prisma.permission.create({
        data: permission,
      });
      createdPermissions.push(created);
    }

    return createdPermissions;
  }

  /**
   * 关联权限到角色
   */
  private async assignPermissionsToRole(
    roleId: string,
    permissionIds: string[],
    prisma: TransactionPrismaClient,
  ): Promise<void> {
    await prisma.role.update({
      where: { id: roleId },
      data: {
        permissions: {
          connect: permissionIds.map((id) => ({ id })),
        },
      },
    });
  }

  /**
   * 创建基础菜单和菜单组
   */
  private async createBaseMenuStructure(
    prisma: TransactionPrismaClient,
  ): Promise<{ menuGroups: MenuGroup[]; menus: Menu[] }> {
    // 创建菜单组
    const systemMenuGroup = await prisma.menuGroup.create({
      data: {
        id: uuid(),
        title: '系统管理',
        icon: 'setting',
        description: '系统管理功能',
      },
    });

    // 创建系统管理菜单项
    const menuItems = [
      {
        title: '用户管理',
        path: '/system/user',
        icon: 'user',
        component: 'system/user/index',
      },
      {
        title: '角色管理',
        path: '/system/role',
        icon: 'users',
        component: 'system/role/index',
      },
      {
        title: '权限管理',
        path: '/system/permission',
        icon: 'shield-user',
        component: 'system/permission/index',
      },
      {
        title: '菜单管理',
        path: '/system/menu',
        icon: 'menu',
        component: 'system/menu/index',
      },
      {
        title: '菜单组管理',
        path: '/system/menu-group',
        icon: 'book-text',
        component: 'system/menu-group/index',
      },
    ];

    const menus: Menu[] = [];

    // 创建菜单及其元数据
    for (const item of menuItems) {
      // 创建元数据
      const menuMate = await prisma.menuMate.create({
        data: {
          id: uuid(),
          title: item.title,
          path: item.path,
          icon: item.icon,
          component: item.component,
        },
      });

      // 创建菜单
      const menu = await prisma.menu.create({
        data: {
          id: uuid(),
          mate_id: menuMate.id,
          groups: {
            connect: { id: systemMenuGroup.id },
          },
        },
      });

      menus.push(menu);
    }

    return {
      menuGroups: [systemMenuGroup],
      menus,
    };
  }

  /**
   * 创建系统字典
   * @param prisma Prisma事务客户端
   * @param menuGroups 已创建的菜单组列表
   */
  private async createSystemDictionaries(
    prisma: TransactionPrismaClient,
    menuGroups: MenuGroup[],
  ): Promise<void> {
    // 创建菜单分组字典
    const menuGroupDict = await prisma.dictionary.create({
      data: {
        id: uuid(),
        code: 'MENU_GROUPS',
        name: '菜单分组',
        description: '系统菜单分组列表，用于前端菜单分组展示',
        items: {
          create: menuGroups.map((group, index) => ({
            id: uuid(),
            value: group.id,
            label: group.title,
            sort: index,
          })),
        },
      },
    });

    this.logger.log(`菜单分组字典创建成功，ID: ${menuGroupDict.id}`);
  }

  /**
   * 标记系统码为已使用
   */
  private async markSystemCodeAsUsed(
    code: string,
    prisma: TransactionPrismaClient,
  ): Promise<void> {
    await prisma.systemCode.update({
      where: { code },
      data: {
        is_used: true,
        update_at: new Date(),
      },
    });
  }

  /**
   * 生成随机的系统码
   */
  private generateRandomCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const segments = [8, 4, 4, 4, 12]; // 格式类似UUID: XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
    let code = '';

    segments.forEach((length, index) => {
      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        code += chars[randomIndex];
      }

      if (index < segments.length - 1) {
        code += '-';
      }
    });

    return code;
  }

  /**
   * 检查系统是否已初始化
   */
  async isSystemInitialized(): Promise<boolean> {
    // 检查是否有管理员角色
    const adminRole = await this.prisma.role.findFirst({
      where: { name: 'system-admin' },
    });

    return !!adminRole;
  }
}
