import { title } from 'process';
import { v4 as uuid } from 'uuid';
import { Injectable } from '@nestjs/common';
import { PaginationQuery } from '@/common/decorators/pagination.decorator';
import { PrismaService } from '@/database/prisma/prisma.service';
import { CreateMenuRequest } from './dto/create-menu.dto';
import { FindMenuQuery, MenuResponse } from './dto/find-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';

@Injectable()
export class MenuService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createMenuDto: CreateMenuRequest): Promise<MenuResponse> {
    const id = uuid();
    const mateId = uuid();

    const { groups, parent_id, ...data } = createMenuDto;

    const menu = await this.prisma.menu.create({
      data: {
        id,
        groups: {
          connect: groups.map((item) => ({
            id: item,
          })),
        },
        parent: {
          connect: {
            id: parent_id,
          },
        },
        Mate: {
          create: {
            id: mateId,
            title: data.title,
            icon: data.icon,
            path: data.path,
            component: data.component,
          },
        },
      },
      include: {
        Mate: {
          select: {
            title: true,
            icon: true,
            path: true,
            component: true,
          },
        },
      },
    });
    return {
      id: menu.id,
      title: menu.Mate.title,
      path: menu.Mate.path ?? '',
      icon: menu.Mate.icon,
      component: menu.Mate.component ?? '',
    };
  }

  async findAll(
    { page, limit, ...where }: FindMenuQuery,
    pagination: PaginationQuery,
  ) {
    const records = await this.prisma.menu.findMany({
      skip: pagination.skip,
      take: pagination.take,
      where,
      include: {
        Mate: {
          select: {
            title: true,
            path: true,
            icon: true,
            component: true,
          },
        },
      },
    });
    const total = await this.prisma.menu.count();
    return {
      records,
      total,
    };
  }

  async findOne(id: string): Promise<MenuResponse> {
    const menu = await this.prisma.menu.findUnique({
      where: {
        id,
      },
      include: {
        Mate: true,
      },
    });
    if (!menu) {
      throw new Error('Menu not found');
    }
    return {
      id: menu.id,
      title: menu.Mate.title,
      path: menu?.Mate.path ?? '',
      icon: menu.Mate.icon,
      component: menu.Mate.component ?? '',
    };
  }

  update(id: string, updateMenuDto: UpdateMenuDto) {
    return this.prisma.menu.update({
      where: {
        id,
      },
      data: {
        parent_id: updateMenuDto.parent_id,
      },
    });
  }

  remove(id: string) {
    return this.prisma.menu.delete({
      where: {
        id,
      },
    });
  }
}
