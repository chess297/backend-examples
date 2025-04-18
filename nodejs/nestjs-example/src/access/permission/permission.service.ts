import { v4 as uuid } from 'uuid';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '@/database/prisma/prisma.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Injectable()
export class PermissionService {
  constructor(private readonly prisma: PrismaService) {}
  create(createPermissionDto: CreatePermissionDto) {
    const id = uuid();
    return this.prisma.permission.create({
      omit: {
        delete_at: true,
      },
      data: {
        id,
        name: createPermissionDto.name,
        description: createPermissionDto.description,
        resource: createPermissionDto.resource,
        actions: createPermissionDto.actions,
      },
    });
  }

  findAll() {
    return this.prisma.permission.findMany({
      where: {
        delete_at: null,
      },
      omit: {
        delete_at: true,
      },
      include: {
        roles: true,
      },
    });
  }

  async findByUserId(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        roles: {
          include: {
            permissions: true,
          },
        },
      },
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    const permissions = user.roles.reduce((acc, role) => {
      const rolePermissions = role.permissions.map((permission) => {
        return {
          id: permission.id,
          name: permission.name,
          description: permission.description,
          resource: permission.resource,
          actions: permission.actions,
        };
      });
      return [...acc, ...rolePermissions];
    }, []);
    return permissions;
  }

  async findOne(id: string) {
    const permission = await this.prisma.permission.findUnique({
      where: {
        id,
      },
    });
    return permission;
  }

  async update(id: string, updatePermissionDto: UpdatePermissionDto) {
    // 这里可以根据id更新权限
    const roles = updatePermissionDto.roles;
    if (roles && roles.length > 0) {
      await this.prisma.permission.update({
        where: {
          id,
        },
        data: {
          roles: {
            connect: roles.map((role) => ({ id: role })),
          },
        },
      });
    }
    return await this.prisma.permission.update({
      where: {
        id,
      },
      data: {
        name: updatePermissionDto.name,
        description: updatePermissionDto.description,
        resource: updatePermissionDto.resource,
      },
    });
  }

  remove(id: string) {
    return this.prisma.permission.delete({
      where: {
        id,
      },
    });
  }
}
