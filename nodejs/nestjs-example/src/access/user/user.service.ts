import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma/prisma.service';
import { CreateUserRequest, UserResponse } from './dto/create-user.dto';
import { UpdateUserRequest } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createUserDto: CreateUserRequest): Promise<UserResponse> {
    // 处理密码
    const salt = await bcrypt.genSalt();
    const password = await bcrypt.hash(createUserDto.password, salt);
    // 处理邮箱

    const user = await this.prisma.user.create({
      data: {
        username: createUserDto.username,
        password: password,
        id: uuid(),
        email: createUserDto.email,
        address: '',
        phone: '',
        country_code: '+86',
      },
    });
    return new UserResponse(user);
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
        return list.map((item) => new UserResponse(item));
      });
    const total = await this.prisma.user.count();
    return {
      records,
      total,
    };
  }

  async findOne(id: string) {
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
    return new UserResponse(user);
  }

  async findOneByEmail(email: string): Promise<UserResponse> {
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
    return new UserResponse(user);
  }

  async update(
    id: string,
    updateUserDto: UpdateUserRequest,
  ): Promise<UserResponse> {
    const { roleIds, roles, ...data } = updateUserDto;
    const user = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        ...data,
        update_at: new Date(),
        roles: {
          connect: roleIds?.map((roleId) => ({
            id: roleId,
          })),
        },
      },
    });
    return new UserResponse(user);
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
