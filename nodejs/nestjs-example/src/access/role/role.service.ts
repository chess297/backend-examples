import { v4 as uuid } from 'uuid';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/database/prisma/prisma.service';
import { CreateRoleRequest } from './dto/create-role.dto';
import { FindManyRoleQuery } from './dto/find.role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RoleService {
  constructor(private readonly prisma: PrismaService) {}

  create(createRoleDto: CreateRoleRequest) {
    const id = uuid();
    const { users, permissions, ...rest } = createRoleDto;
    return this.prisma.role.create({
      omit: {
        delete_at: true,
      },
      data: {
        ...rest,
        id,
        users: {
          connect: users?.map((item) => ({ id: item })),
        },
        permissions: {
          connect: permissions?.map((item) => ({ id: item })),
        },
      },
    });
  }

  async findAll(query: FindManyRoleQuery) {
    const { page = 1, limit = 10, ...where } = query;
    const records = await this.prisma.role.findMany({
      omit: {
        delete_at: true,
      },
      where: where,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        permissions: true,
        users: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });
    const total = await this.prisma.role.count();
    return {
      records,
      total,
    };
  }

  async findOne(id: string) {
    const role = await this.prisma.role.findUnique({
      omit: {
        delete_at: true,
      },
      where: {
        id,
      },
      include: {
        permissions: true,
        users: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    return role;
  }

  findOneByName(name: string) {
    return this.prisma.role.findUnique({
      omit: {
        delete_at: true,
      },
      where: {
        name,
      },
    });
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    const { users, permissions, ...data } = updateRoleDto;

    // First update basic role information
    await this.prisma.role.update({
      where: {
        id,
      },
      data: {
        ...data,
        update_at: new Date(),
      },
    });

    // If users need to be updated
    if (users && users.length > 0) {
      // First disconnect all existing users
      await this.prisma.role.update({
        where: { id },
        data: {
          users: {
            set: [], // Clear existing connections
          },
        },
      });

      // Then connect the new users
      await this.prisma.role.update({
        where: { id },
        data: {
          users: {
            connect: users.map((userId) => ({ id: userId })),
          },
        },
      });
    }

    // If permissions need to be updated
    if (permissions && permissions.length > 0) {
      // First disconnect all existing permissions
      await this.prisma.role.update({
        where: { id },
        data: {
          permissions: {
            set: [], // Clear existing connections
          },
        },
      });

      // Then connect the new permissions
      await this.prisma.role.update({
        where: { id },
        data: {
          permissions: {
            connect: permissions.map((permId) => ({ id: permId })),
          },
        },
      });
    }

    // Return the updated role
    return this.findOne(id);
  }

  async remove(id: string) {
    // Check if role exists
    const role = await this.prisma.role.findUnique({
      where: { id },
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    // Don't allow deletion of system-admin role
    if (role.name === 'system-admin') {
      throw new Error('Cannot delete the system-admin role');
    }

    // Use soft delete pattern
    return this.prisma.role.update({
      where: { id },
      data: {
        delete_at: new Date(),
      },
    });
  }
}
