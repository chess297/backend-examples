import { v4 as uuid } from 'uuid';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/database/prisma/prisma.service';
import { CreateMenuMateDto } from './dto/create-menu-mate.dto';
import { FindMenuMateQuery } from './dto/find-menu-mate.dto';
import { UpdateMenuMateDto } from './dto/update-menu-mate.dto';

@Injectable()
export class MenuMateService {
  private readonly logger = new Logger(MenuMateService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(createMenuMateDto: CreateMenuMateDto) {
    const id = uuid();
    try {
      const mate = await this.prisma.menuMate.create({
        data: {
          ...createMenuMateDto,
          id,
        },
      });

      return mate;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(
        `Failed to create menu mate: ${errorMessage}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }
  }

  async findAll(query?: FindMenuMateQuery) {
    const { page = 1, limit = 10, ...filters } = query || {};

    try {
      const records = await this.prisma.menuMate.findMany({
        where: {
          ...filters,
          delete_at: null,
        },
        skip: (page - 1) * limit,
        take: limit,
      });

      const total = await this.prisma.menuMate.count({
        where: {
          ...filters,
          delete_at: null,
        },
      });

      return {
        records,
        total,
        page,
        limit,
      };
    } catch (error) {
      this.logger.error(
        `Failed to fetch menu mates: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const menuMate = await this.prisma.menuMate.findUnique({
        where: { id },
      });

      if (!menuMate) {
        throw new NotFoundException(`MenuMate with ID ${id} not found`);
      }

      return menuMate;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to fetch menu mate: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }
  }

  async update(id: string, updateMenuMateDto: UpdateMenuMateDto) {
    try {
      // Check if the entity exists
      await this.findOne(id);

      return this.prisma.menuMate.update({
        where: { id },
        data: {
          ...updateMenuMateDto,
          update_at: new Date(),
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to update menu mate: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }
  }

  async remove(id: string) {
    try {
      // Check if the entity exists
      await this.findOne(id);

      // Use soft delete pattern if delete_at column exists,
      // otherwise perform hard delete
      if (await this.hasSoftDelete()) {
        return this.prisma.menuMate.update({
          where: { id },
          data: {
            delete_at: new Date(),
          },
        });
      } else {
        return this.prisma.menuMate.delete({
          where: { id },
        });
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to delete menu mate: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }
  }

  // Helper method to check if the model supports soft delete
  private async hasSoftDelete(): Promise<boolean> {
    try {
      // Try to query a record with delete_at field to check if it exists
      await this.prisma.menuMate.findFirst({
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
