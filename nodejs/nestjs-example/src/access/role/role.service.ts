import { v4 as uuid } from 'uuid';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma/prisma.service';
import { CreateRoleRequest } from './dto/create-role.dto';
import { FindManyRoleQuery } from './dto/find.role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

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

  async findAll(query: FindManyRoleQuery) {
    const { page, limit, ...where } = query;
    const roles = await this.prisma.role.findMany({
      omit: {
        delete_at: true,
      },
      where: where,
      skip: (page - 1) * limit,
      take: limit,
    });
    const total = await this.prisma.role.count();
    return {
      records: roles,
      total,
    };
  }

  findOne(id: string) {
    return this.prisma.role.findUnique({
      omit: {
        delete_at: true,
      },
      where: {
        id,
      },
    });
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
