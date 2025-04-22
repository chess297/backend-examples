import { v4 as uuid } from 'uuid';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/database/prisma/prisma.service';
import {
  CreateRoleRequest,
  CreateRoleResponse,
  RoleResponse,
} from './dto/create-role.dto';
import { FindManyRoleQuery } from './dto/find.role.dto';
import { UpdateRoleRequest } from './dto/update-role.dto';

@Injectable()
export class RoleService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createRoleDto: CreateRoleRequest): Promise<CreateRoleResponse> {
    const id = uuid();
    const { user_ids, permission_ids, ...rest } = createRoleDto;
    const role = await this.prisma.role.create({
      omit: {
        delete_at: true,
      },
      data: {
        ...rest,
        id,
        users: {
          connect: user_ids?.map((item) => ({ id: item })),
        },
        permissions: {
          connect: permission_ids?.map((item) => ({ id: item })),
        },
      },
    });
    return new CreateRoleResponse(role);
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

  async findOne(id: string): Promise<RoleResponse> {
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

    return new RoleResponse(role);
  }

  async findOneByName(name: string): Promise<RoleResponse> {
    const role = await this.prisma.role.findUnique({
      omit: {
        delete_at: true,
      },
      where: {
        name,
      },
    });
    if (!role) {
      throw new NotFoundException(`Role with name ${name} not found`);
    }
    return new RoleResponse(role);
  }

  async update(id: string, updateRoleDto: UpdateRoleRequest) {
    const { user_ids, permission_ids, ...data } = updateRoleDto;

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
    if (user_ids && user_ids.length > 0) {
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
            connect: user_ids.map((userId) => ({ id: userId })),
          },
        },
      });
    }

    // If permissions need to be updated
    if (permission_ids && permission_ids.length > 0) {
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
            connect: permission_ids.map((permId) => ({ id: permId })),
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
