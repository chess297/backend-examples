import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/database/prisma/prisma.service';
import { CreateUserRequest, GetUserResponse } from './dto/create-user.dto';
import { UpdateUserRequest } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(private readonly prisma: PrismaService) {}
  async create(createUserDto: CreateUserRequest) {
    // 处理密码
    const salt = await bcrypt.genSalt();
    const password = await bcrypt.hash(createUserDto.password, salt);
    // 处理邮箱

    const user = await this.prisma.user
      .create({
        data: {
          username: createUserDto.username,
          password: password,
          id: uuid(),
          email: createUserDto.email,
          address: '',
          phone: '',
          country_code: '+86',
        },
      })
      .catch((err: Prisma.PrismaClientKnownRequestError) => {
        if (err.code === 'P2002') {
          // TODO 处理有可能导致的类型错误
          const target = err.meta?.target as string[] | null;
          if (target && target?.includes('name')) {
            throw new BadRequestException('用户名已存在');
          } else if (target && target?.includes('domain')) {
            throw new BadRequestException(
              '邮箱已注册，请更换邮箱或使用此邮箱登录',
            );
          }
        }
      });
    return user;
  }

  async findAll() {
    const records = await this.prisma.user
      .findMany({
        where: {
          delete_at: null,
        },
        include: {
          roles: true,
        },
        omit: {
          delete_at: true,
          password: true,
        },
      })
      .then((list) => {
        return list.map(
          (item) =>
            new GetUserResponse({
              ...item,
            }),
        );
      });
    const total = await this.prisma.user.count();
    return {
      records,
      total,
    };
  }

  async findOne(id: string) {
    console.log('🚀 ~ UserService ~ findOne ~ id:', id);
    const user = await this.prisma.user.findUnique({
      omit: {
        delete_at: true,
      },
      where: {
        id,
      },
    });
    if (!user) {
      throw new BadRequestException('用户不存在');
    }
    return new GetUserResponse(user);
  }

  async findOneByEmail(email: string): Promise<UserEntity> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
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
      throw new BadRequestException('用户不存在');
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserRequest) {
    let localPart: string | null = null,
      domain: string | null = null;
    if (updateUserDto.email) {
      [localPart, domain] = updateUserDto.email.split('@');
    }
    const data = {
      ...updateUserDto,

      localPart,
      domain,
    };
    const user = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        username: data.username,
        email: data.email,
        update_at: new Date(),
      },
    });
    return user;
  }

  async remove(id: string) {
    // 删除用户
    await this.prisma.user.delete({
      where: {
        id,
      },
    });

    return {
      success: true,
    };
  }

  async removeMany(ids: string[]) {
    for (const id of ids) {
      await this.prisma.user.delete({
        where: {
          id,
        },
      });
    }
    return null;
  }
}
