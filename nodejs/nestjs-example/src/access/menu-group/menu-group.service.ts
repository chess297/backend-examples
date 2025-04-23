import { Prisma } from '@prisma/client';
import { v4 as uuid } from 'uuid';
import { Injectable, Logger, NotFoundException, Req } from '@nestjs/common';
import {
  Pagination,
  PaginationQuery,
} from '@/common/decorators/pagination.decorator';
import { PrismaService } from '@/database/prisma/prisma.service';
import { DictionaryService } from '@/modules/dictionary/dictionary.service';
import { CreateMenuGroupRequest } from './dto/create-menu-group.dto';
import { MenuGroupQuery } from './dto/find-menu-group.dto';
import { UpdateMenuGroupRequest } from './dto/update-menu-group.dto';

@Injectable()
export class MenuGroupService {
  private readonly logger = new Logger(MenuGroupService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly dictionaryService: DictionaryService,
  ) {}

  async create(createMenuGroupDto: CreateMenuGroupRequest) {
    try {
      const id = uuid();
      const { menus, permissions, ...rest } = createMenuGroupDto;

      const result = await this.prisma.menuGroup.create({
        data: {
          ...rest,
          id,
          menus: {
            connect: menus?.map((menu_id) => ({ id: menu_id })) || [],
          },
          permissions: {
            connect:
              permissions?.map((permission_id) => ({ id: permission_id })) ||
              [],
          },
        },
        include: {
          menus: true,
          permissions: true,
        },
      });

      // 同步更新菜单分组字典
      // await this.dictionaryService.syncMenuGroupDictionary().catch((error) => {
      //   this.logger.error(
      //     `创建菜单组后同步字典失败: ${error.message}`,
      //     error.stack,
      //   );
      // });

      return result;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        this.logger.error(
          `Failed to create menu group: ${error.message}`,
          error.stack,
        );
        throw error;
      }
    }
  }

  async findAll(query: MenuGroupQuery, pagination: PaginationQuery) {
    try {
      const { page = 1, limit = 10, title, ...filters } = query;

      const records = await this.prisma.menuGroup.findMany({
        where: filters,
        take: pagination.take,
        skip: pagination.skip,
        include: {
          menus: true,
          permissions: true,
          // Include parent and child relationships
        },
        orderBy: {
          create_at: 'desc',
        },
      });

      const total = await this.prisma.menuGroup.count({ where: { title } });

      return {
        records,
        total,
        page,
        limit,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        this.logger.error(
          `Failed to create menu group: ${error.message}`,
          error.stack,
        );
        throw error;
      }
    }
  }

  async findOne(id: string, is_admin?: boolean, permissions?: string[]) {
    try {
      const group = await this.prisma.menuGroup.findUnique({
        where: { id },
        include: {
          permissions: true,
          menus: true,
        },
      });

      if (!group) {
        throw new NotFoundException(`Menu group with ID ${id} not found`);
      }

      // // Permission check - if the user is not admin and the group has permissions
      // if (group?.permissions?.length && !is_admin) {
      //   const hasPermission = userpermissions?.some((permission) => {
      //     return group?.permissions?.some((groupPermission) => {
      //       const actionPermission = groupPermission.actions.reduce(
      //         (acc, cur) => {
      //           return [...acc, `${groupPermission.resource}:${cur}`];
      //         },
      //         [],
      //       );
      //       return actionPermission.includes(permission);
      //     });
      //   });

      //   if (!hasPermission) {
      //     return null;
      //   }
      // }
      return group;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        this.logger.error(
          `Failed to fetch menu group: ${error.message}`,
          error.stack,
        );
        throw error;
      }
    }
  }

  async update(id: string, updateMenuGroupDto: UpdateMenuGroupRequest) {
    try {
      // Verify group exists
      await this.findOne(id);

      const { menus, permissions, ...rest } = updateMenuGroupDto;

      await this.prisma.menuGroup.update({
        where: { id },
        data: {
          ...rest,
          update_at: new Date(),
          menus: {
            // connect: menus?.map((menu_id) => ({ id: menu_id })) || [],
          },
          permissions: {
            // connect:
            //   permissions?.map((permission_id) => ({ id: permission_id })) ||
            //   [],
          },
        },
        include: {
          menus: true,
          permissions: true,
        },
      });

      // 同步更新菜单分组字典
      // await this.dictionaryService.syncMenuGroupDictionary().catch((error) => {
      //   this.logger.error(
      //     `更新菜单组后同步字典失败: ${error.message}`,
      //     error.stack,
      //   );
      // });

      // Return updated group
      return this.findOne(id);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        this.logger.error(
          `Failed to create menu group: ${error.message}`,
          error.stack,
        );
        throw error;
      }
    }
  }

  async remove(id: string) {
    try {
      // Verify group exists
      await this.findOne(id);

      // Check if soft delete is supported
      if (await this.hasSoftDelete()) {
        const result = await this.prisma.menuGroup.update({
          where: { id },
          data: {
            delete_at: new Date(),
          },
        });

        // 同步更新菜单分组字典
        // await this.dictionaryService
        //   .syncMenuGroupDictionary()
        //   .catch((error) => {
        //     this.logger.error(
        //       `删除菜单组后同步字典失败: ${error.message}`,
        //       error.stack,
        //     );
        //   });

        return result;
      } else {
        const result = await this.prisma.menuGroup.delete({
          where: { id },
        });

        // 同步更新菜单分组字典
        // await this.dictionaryService
        //   .syncMenuGroupDictionary()
        //   .catch((error) => {
        //     this.logger.error(
        //       `删除菜单组后同步字典失败: ${error.message}`,
        //       error.stack,
        //     );
        //   });

        return result;
      }
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        this.logger.error(
          `Failed to remove menu group: ${error.message}`,
          error.stack,
        );
        throw error;
      }
    }
  }

  // Helper method to check if soft delete is supported
  private async hasSoftDelete(): Promise<boolean> {
    try {
      await this.prisma.menuGroup.findFirst({
        where: { delete_at: null },
        select: { id: true },
      });
      return true;
    } catch {
      return false;
    }
  }
}
