import { Request } from 'express';
import { v4 as uuid } from 'uuid';
import { Injectable, Req } from '@nestjs/common';
import { PrismaService } from '@/database/prisma/prisma.service';
import { CreateMenuGroupDto } from './dto/create-menu-group.dto';
import { FindMenuGroupQuery } from './dto/find-menu-group.dto';
import { UpdateMenuGroupDto } from './dto/update-menu-group.dto';

@Injectable()
export class MenuGroupService {
  constructor(private readonly prisma: PrismaService) {}
  create(createMenuGroupDto: CreateMenuGroupDto) {
    const id = uuid();
    const { menu_ids, ...rest } = createMenuGroupDto;
    return this.prisma.menuGroup.create({
      data: {
        ...rest,
        id,
        menus: {
          connect: menu_ids?.map((menu_id) => ({ id: menu_id })),
        },
      },
    });
  }

  async findAll(query: FindMenuGroupQuery) {
    const { page, limit, ...where } = query;
    const records = await this.prisma.menuGroup.findMany({
      where,
      take: limit,
      skip: (page - 1) * limit,
      include: {
        menus: {
          include: {
            mate: true,
          },
        },
      },
    });
    const total = await this.prisma.menuGroup.count();
    return {
      records,
      total,
    };
  }

  async findOne(id: string, userPermissions?: string[]) {
    const group = await this.prisma.menuGroup.findUnique({
      where: { id },
      include: {
        permissions: true,
        menus: {
          include: {
            mate: true,
          },
        },
      },
    });
    if (group?.permissions?.length) {
      const hasPermission = userPermissions?.some((permission) => {
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
  }

  update(id: string, updateMenuGroupDto: UpdateMenuGroupDto) {
    const { menu_ids, ...rest } = updateMenuGroupDto;
    return this.prisma.menuGroup.update({
      where: { id },
      data: {
        ...rest,
        menus: {
          connect: menu_ids?.map((menu_id) => ({ id: menu_id })),
        },
      },
    });
  }

  remove(id: string) {
    return this.prisma.menuGroup.delete({
      where: { id },
    });
  }
}
