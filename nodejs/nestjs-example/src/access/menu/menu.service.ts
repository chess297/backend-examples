import { v4 as uuid } from 'uuid';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma/prisma.service';
import { CreateMenuRequest } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';

@Injectable()
export class MenuService {
  constructor(private readonly prisma: PrismaService) {}
  create(createMenuDto: CreateMenuRequest) {
    const id = uuid();
    return this.prisma.menu.create({
      data: {
        id,
        name: createMenuDto.name,
        path: createMenuDto.path,
        icon: createMenuDto.icon,
        component: createMenuDto.component,
        parent_id: createMenuDto.parent_id,
      },
    });
  }

  async findAll() {
    const records = await this.prisma.menu.findMany();
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
        name: updateMenuDto.name,
        path: updateMenuDto.path,
        icon: updateMenuDto.icon,
        component: updateMenuDto.component,
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
