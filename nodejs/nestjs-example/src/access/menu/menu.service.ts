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

    const { groups, parent_id, ...data } = createMenuDto;

    const menu = await this.prisma.menu.create({
      data: {
        ...data,
        id,
        groups: {
          connect: groups.map((item) => ({
            id: item,
          })),
        },
        parent_id,
      },
    });
    return menu;
  }

  async findAll(
    { page, limit, ...where }: FindMenuQuery,
    pagination: PaginationQuery,
  ) {
    const menus = await this.prisma.menu.findMany({
      skip: pagination.skip,
      take: pagination.take,
      where,
    });

    // 扁平化菜单数据，将 Mate 中的数据直接映射到菜单对象
    const records = menus;

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
        groups: true,
        parent: true,
        children: true,
      },
    });

    if (!menu) {
      throw new Error('Menu not found');
    }

    // 扁平化菜单数据
    return menu;
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
