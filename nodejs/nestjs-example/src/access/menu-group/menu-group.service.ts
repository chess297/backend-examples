import { v4 as uuid } from 'uuid';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma/prisma.service';
import { CreateMenuGroupDto } from './dto/create-menu-group.dto';
import { FindMenuGroupQuery } from './dto/find-menu-group.dto';
import { UpdateMenuGroupDto } from './dto/update-menu-group.dto';

@Injectable()
export class MenuGroupService {
  constructor(private readonly prisma: PrismaService) {}
  create(createMenuGroupDto: CreateMenuGroupDto) {
    const id = uuid();
    return this.prisma.menuGroup.create({
      data: {
        ...createMenuGroupDto,
        id,
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

  findOne(id: string) {
    return this.prisma.menuGroup.findUnique({
      where: { id },
    });
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
