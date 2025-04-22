import { Prisma } from '@prisma/client';
import { v4 as uuid } from 'uuid';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/database/prisma/prisma.service';
import { CreateDictionaryDto } from './dto/create-dictionary.dto';
import { FindDictionaryDto } from './dto/find-dictionary.dto';
import { UpdateDictionaryDto } from './dto/update-dictionary.dto';

@Injectable()
export class DictionaryService {
  private readonly logger = new Logger(DictionaryService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(createDictionaryDto: CreateDictionaryDto) {
    try {
      const { items, ...dictionaryData } = createDictionaryDto;

      return this.prisma.dictionary.create({
        data: {
          id: uuid(),
          ...dictionaryData,
          items: items
            ? {
                create: items.map((item) => ({
                  id: uuid(),
                  ...item,
                  extra: item.extra ? (item.extra as any) : undefined,
                })),
              }
            : undefined,
        },
        include: {
          items: {
            orderBy: {
              sort: 'asc',
            },
          },
        },
      });
    } catch (error) {
      this.logger.error(`创建字典失败: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll(query: FindDictionaryDto) {
    try {
      const { page = 1, limit = 10, code, name } = query;
      const skip = (page - 1) * limit;

      const where: Prisma.DictionaryWhereInput = {
        delete_at: null,
      };

      if (code) {
        where.code = {
          contains: code,
        };
      }

      if (name) {
        where.name = {
          contains: name,
        };
      }

      const [records, total] = await Promise.all([
        this.prisma.dictionary.findMany({
          where,
          skip,
          take: limit,
          include: {
            items: {
              where: {
                delete_at: null,
              },
              orderBy: {
                sort: 'asc',
              },
            },
          },
          orderBy: {
            create_at: 'desc',
          },
        }),
        this.prisma.dictionary.count({ where }),
      ]);

      return {
        records,
        total,
        page,
        limit,
      };
    } catch (error) {
      this.logger.error(`查询字典列表失败: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const dictionary = await this.prisma.dictionary.findUnique({
        where: { id, delete_at: null },
        include: {
          items: {
            where: {
              delete_at: null,
            },
            orderBy: {
              sort: 'asc',
            },
          },
        },
      });

      if (!dictionary) {
        throw new NotFoundException(`字典 ${id} 不存在`);
      }

      return dictionary;
    } catch (error) {
      this.logger.error(`查询字典详情失败: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findByCode(code: string) {
    try {
      const dictionary = await this.prisma.dictionary.findUnique({
        where: { code, delete_at: null },
        include: {
          items: {
            where: {
              delete_at: null,
            },
            orderBy: {
              sort: 'asc',
            },
          },
        },
      });

      if (!dictionary) {
        throw new NotFoundException(`字典代码 ${code} 不存在`);
      }

      return dictionary;
    } catch (error) {
      this.logger.error(`通过代码查询字典失败: ${error.message}`, error.stack);
      throw error;
    }
  }

  async update(id: string, updateDictionaryDto: UpdateDictionaryDto) {
    try {
      // 确认字典存在
      await this.findOne(id);

      const { items, ...dictionaryData } = updateDictionaryDto;

      // 更新字典基本信息
      const updatedDictionary = await this.prisma.dictionary.update({
        where: { id },
        data: {
          ...dictionaryData,
          update_at: new Date(),
        },
      });

      // 如果提供了字典项，处理字典项的更新
      if (items && items.length > 0) {
        // 删除现有字典项
        await this.prisma.dictionaryItem.updateMany({
          where: { dictionary_id: id },
          data: { delete_at: new Date() },
        });

        // 添加新的字典项
        await this.prisma.dictionaryItem.createMany({
          data: items.map((item) => ({
            id: uuid(),
            dictionary_id: id,
            ...item,
            extra: item.extra || undefined,
            create_at: new Date(),
            update_at: new Date(),
          })),
        });
      }

      // 返回更新后的完整字典对象
      return this.findOne(id);
    } catch (error) {
      this.logger.error(`更新字典失败: ${error.message}`, error.stack);
      throw error;
    }
  }

  async remove(id: string) {
    try {
      // 确认字典存在
      await this.findOne(id);

      // 软删除字典
      await this.prisma.dictionary.update({
        where: { id },
        data: { delete_at: new Date() },
      });

      // 软删除所有关联的字典项
      await this.prisma.dictionaryItem.updateMany({
        where: { dictionary_id: id },
        data: { delete_at: new Date() },
      });

      return { id, message: '字典已删除' };
    } catch (error) {
      this.logger.error(`删除字典失败: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * 同步更新菜单分组字典
   * 当菜单分组发生变化时，同步更新字典数据
   */
  async syncMenuGroupDictionary(): Promise<void> {
    try {
      // 查找菜单分组字典
      const menuGroupDict = await this.prisma.dictionary.findUnique({
        where: { code: 'MENU_GROUPS' },
      });

      if (!menuGroupDict) {
        this.logger.warn('菜单分组字典不存在，将创建新的字典');
        await this.createMenuGroupDictionary();
        return;
      }

      // 获取所有未删除的菜单组
      const menuGroups = await this.prisma.menuGroup.findMany({
        where: { delete_at: null },
        orderBy: { create_at: 'asc' },
      });

      // 软删除旧的字典项
      await this.prisma.dictionaryItem.updateMany({
        where: { dictionary_id: menuGroupDict.id },
        data: { delete_at: new Date() },
      });

      // 创建新的字典项
      await this.prisma.dictionaryItem.createMany({
        data: menuGroups.map((group, index) => ({
          id: uuid(),
          dictionary_id: menuGroupDict.id,
          value: group.id,
          label: group.title,
          sort: index,
          extra: {
            icon: group.icon,
            description: group.description,
          },
        })),
      });

      this.logger.log(
        `菜单分组字典已同步更新，包含 ${menuGroups.length} 个菜单组`,
      );
    } catch (error) {
      this.logger.error(
        `同步更新菜单分组字典失败: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * 创建菜单分组字典
   * 如果不存在菜单分组字典，则创建一个新的
   */
  async createMenuGroupDictionary(): Promise<void> {
    try {
      // 检查字典是否已存在
      const existingDict = await this.prisma.dictionary.findUnique({
        where: { code: 'MENU_GROUPS' },
      });

      if (existingDict) {
        this.logger.log('菜单分组字典已存在，跳过创建');
        return;
      }

      // 获取所有未删除的菜单组
      const menuGroups = await this.prisma.menuGroup.findMany({
        where: { delete_at: null },
        orderBy: { create_at: 'asc' },
      });

      // 创建字典及字典项
      await this.prisma.dictionary.create({
        data: {
          id: uuid(),
          code: 'MENU_GROUPS',
          name: '菜单分组',
          description: '系统菜单分组列表，用于前端菜单分组展示',
          items: {
            create: menuGroups.map((group, index) => ({
              id: uuid(),
              value: group.id,
              label: group.title,
              sort: index,
              extra: {
                icon: group.icon,
                description: group.description,
              },
            })),
          },
        },
      });

      this.logger.log(
        `菜单分组字典创建成功，包含 ${menuGroups.length} 个菜单组`,
      );
    } catch (error) {
      this.logger.error(`创建菜单分组字典失败: ${error.message}`, error.stack);
      throw error;
    }
  }
}
