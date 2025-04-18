import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma/prisma.service';
import { CreateMenuMateDto } from './dto/create-menu-mate.dto';
import { UpdateMenuMateDto } from './dto/update-menu-mate.dto';

@Injectable()
export class MenuMateService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createMenuMateDto: CreateMenuMateDto) {
    const { ...data } = createMenuMateDto;
    const mate = await this.prisma.menuMate
      .create({
        data: data,
      })
      .catch((err) => {
        console.log(err);
      });
    return mate;
  }

  findAll() {
    return this.prisma.menuMate.findMany();
  }

  findOne(id: string) {
    return this.prisma.menuMate.findUnique({
      where: { id },
    });
  }

  update(id: string, updateMenuMateDto: UpdateMenuMateDto) {
    return this.prisma.menuMate.update({
      where: { id },
      data: updateMenuMateDto,
    });
  }

  remove(id: string) {
    return this.prisma.menuMate.delete({
      where: { id },
    });
  }
}
