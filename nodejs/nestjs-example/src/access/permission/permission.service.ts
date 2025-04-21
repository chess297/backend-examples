import { v4 as uuid } from 'uuid';
import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '@/database/prisma/prisma.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { FindPermissionQuery } from './dto/find-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Injectable()
export class PermissionService {
  private readonly logger = new Logger(PermissionService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(createPermissionDto: CreatePermissionDto) {
    try {
      const id = uuid();
      return await this.prisma.permission.create({
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
        include: {
          roles: true,
        },
      });
    } catch (error) {
      this.logger.error(
        `Failed to create permission: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findAll(query?: FindPermissionQuery) {
    try {
      const { page = 1, limit = 10, resource, name, ...filters } = query || {};

      const whereClause: any = {
        delete_at: null,
        ...filters,
      };

      if (resource) {
        whereClause.resource = { contains: resource };
      }

      if (name) {
        whereClause.name = { contains: name };
      }

      const records = await this.prisma.permission.findMany({
        where: whereClause,
        omit: {
          delete_at: true,
        },
        include: {
          roles: true,
        },
        skip: (page - 1) * limit,
        take: limit,
      });

      const total = await this.prisma.permission.count({
        where: whereClause,
      });

      return {
        records,
        total,
        page,
        limit,
      };
    } catch (error) {
      this.logger.error(
        `Failed to find permissions: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findByUserId(id: string) {
    try {
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
        throw new UnauthorizedException('User not found');
      }

      // Extract unique permissions from all user roles
      const permissionMap = new Map();

      user.roles.forEach((role) => {
        role.permissions.forEach((permission) => {
          permissionMap.set(permission.id, {
            id: permission.id,
            name: permission.name,
            description: permission.description,
            resource: permission.resource,
            actions: permission.actions,
          });
        });
      });

      return Array.from(permissionMap.values());
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      this.logger.error(
        `Failed to find permissions by user ID: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const permission = await this.prisma.permission.findUnique({
        where: {
          id,
        },
        include: {
          roles: true,
        },
      });

      if (!permission) {
        throw new NotFoundException(`Permission with ID ${id} not found`);
      }

      return permission;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to find permission: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async update(id: string, updatePermissionDto: UpdatePermissionDto) {
    try {
      // Check if permission exists
      await this.findOne(id);

      const { roles, actions, ...data } = updatePermissionDto;

      // Update basic permission data
      let updatedPermission = await this.prisma.permission.update({
        where: { id },
        data: {
          ...data,
          ...(actions && { actions }),
          update_at: new Date(),
        },
        include: {
          roles: true,
        },
      });

      // If roles are provided, update role relationships
      if (roles && roles.length > 0) {
        // First disconnect all roles
        await this.prisma.permission.update({
          where: { id },
          data: {
            roles: {
              set: [], // Clear existing relationships
            },
          },
        });

        // Then connect new roles
        updatedPermission = await this.prisma.permission.update({
          where: { id },
          data: {
            roles: {
              connect: roles.map((roleId) => ({ id: roleId })),
            },
          },
          include: {
            roles: true,
          },
        });
      }

      return updatedPermission;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to update permission: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async remove(id: string) {
    try {
      // Check if permission exists
      await this.findOne(id);

      // Use soft delete if supported
      if (await this.hasSoftDelete()) {
        return this.prisma.permission.update({
          where: { id },
          data: {
            delete_at: new Date(),
          },
        });
      } else {
        // Hard delete if soft delete not supported
        return this.prisma.permission.delete({
          where: { id },
        });
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to delete permission: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  // Helper method to check if soft delete is supported
  private async hasSoftDelete(): Promise<boolean> {
    try {
      await this.prisma.permission.findFirst({
        where: {
          delete_at: null,
        },
        select: { id: true },
      });
      return true;
    } catch {
      return false;
    }
  }
}
