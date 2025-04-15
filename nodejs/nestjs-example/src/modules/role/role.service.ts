import { Injectable } from '@nestjs/common';
import { CreateRoleRequest } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { v4 as uuid } from 'uuid';
import { PrismaService } from '@/database/prisma/prisma.service';

@Injectable()
export class RoleService {
  constructor(private readonly prisma: PrismaService) {}

  create(createRoleDto: CreateRoleRequest) {
    const id = uuid();
    return this.prisma.role.create({
      omit: {
        delete_at: true,
      },
      data: {
        id,
        name: createRoleDto.name,
        description: createRoleDto.description,
      },
    });
  }

  findAll() {
    return this.prisma.role.findMany({
      where: {
        delete_at: null,
      },
      omit: {
        delete_at: true,
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} role`;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    const userIds: string[] = [];
    if (updateRoleDto.users) {
      userIds.push(...updateRoleDto.users);
    }

    await this.prisma.role.update({
      where: {
        id,
      },
      data: {
        name: updateRoleDto.name,
        description: updateRoleDto.description,
      },
    });
    const role = await this.prisma.role.findUnique({
      where: {
        id,
      },
      include: {
        users: true,
      },
    });
    console.log('🚀 ~ RoleService ~ update ~ role:', role);

    if (userIds.length > 0) {
      for (const uid of userIds) {
        await this.prisma.role.update({
          where: {
            id,
          },
          data: {
            users: {
              connect: {
                id: uid,
              },
            },
          },
        });
      }
    }
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
