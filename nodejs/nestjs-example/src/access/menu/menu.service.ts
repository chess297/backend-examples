import { v4 as uuid } from 'uuid';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma/prisma.service';
import { CreateMenuRequest } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';

@Injectable()
export class MenuService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createMenuDto: CreateMenuRequest) {
    const id = uuid();
    const mate = {
      id: uuid(),
      title: createMenuDto.title,
      path: createMenuDto.path,
      icon: createMenuDto.icon,
      component: createMenuDto.component,
    };
    return this.prisma.menu.create({
      data: {
        id,
        parent_id: createMenuDto.parent_id,
        group_id: createMenuDto.group_id,
        mate: {
          create: {
            ...mate,
          },
        },
      },
    });
  }

  async findAll() {
    const records = await this.prisma.menu.findMany({
      include: {
        mate: true,
      },
    });
    return {
      records,
      total: records.length,
    };
  }

  findOne(id: string) {
    return this.prisma.menu.findUnique({
      where: {
        id,
      },
    });
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
