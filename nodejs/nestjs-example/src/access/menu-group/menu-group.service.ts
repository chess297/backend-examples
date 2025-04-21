import { Prisma } from '@prisma/client';
import { v4 as uuid } from 'uuid';
import { Injectable, Logger, NotFoundException, Req } from '@nestjs/common';
import {
  Pagination,
  PaginationQuery,
} from '@/common/decorators/pagination.decorator';
import { PrismaService } from '@/database/prisma/prisma.service';
import { CreateMenuGroupRequest } from './dto/create-menu-group.dto';
import { FindMenuGroupQuery } from './dto/find-menu-group.dto';
import { UpdateMenuGroupDto } from './dto/update-menu-group.dto';

@Injectable()
export class MenuGroupService {
  private readonly logger = new Logger(MenuGroupService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(createMenuGroupDto: CreateMenuGroupRequest) {
    try {
      const id = uuid();
      const { menus, permissions, ...rest } = createMenuGroupDto;

      return await this.prisma.menuGroup.create({
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
          menus: {
            include: {
              Mate: true,
            },
          },
          permissions: true,
        },
      });
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

  async findAll(query: FindMenuGroupQuery, pagination: PaginationQuery) {
    try {
      const { page = 1, limit = 10, title, ...filters } = query;

      const records = await this.prisma.menuGroup.findMany({
        where: {
          title,
        },
        take: pagination.take,
        skip: pagination.skip,
        include: {
          menus: {
            include: {
              Mate: true,
            },
          },
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

  async findOne(id: string, is_admin?: boolean, userpermissions?: string[]) {
    try {
      const group = await this.prisma.menuGroup.findUnique({
        where: { id },
        include: {
          permissions: true,
          menus: {
            include: {
              Mate: true,
            },
          },
        },
      });

      if (!group) {
        throw new NotFoundException(`Menu group with ID ${id} not found`);
      }

      // Permission check - if the user is not admin and the group has permissions
      if (group?.permissions?.length && !is_admin) {
        const hasPermission = userpermissions?.some((permission) => {
          return group?.permissions?.some((groupPermission) => {
            const actionPermission = groupPermission.actions.reduce(
              (acc, cur) => {
                return [...acc, `${groupPermission.resource}:${cur}`];
              },
              [],
            );
            return actionPermission.includes(permission);
          });
        });

        if (!hasPermission) {
          return null;
        }
      }

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

  async update(id: string, updateMenuGroupDto: UpdateMenuGroupDto) {
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
        return this.prisma.menuGroup.update({
          where: { id },
          data: {
            delete_at: new Date(),
          },
        });
      } else {
        return this.prisma.menuGroup.delete({
          where: { id },
        });
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
