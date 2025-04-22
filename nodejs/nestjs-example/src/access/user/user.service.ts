import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PaginationQuery } from '@/common/decorators/pagination.decorator';
import { PaginationData } from '@/common/dto/api.dto';
import { PrismaService } from '@/database/prisma/prisma.service';
import { CreateUserRequest, UserResponse } from './dto/create-user.dto';
import { UserQuery } from './dto/query-user.dto';
import { UpdateUserRequest } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createUserDto: CreateUserRequest): Promise<UserResponse> {
    // 处理密码
    const salt = await bcrypt.genSalt();
    console.log('🚀 ~ UserService ~ create ~ salt:', salt, createUserDto);
    const password = await bcrypt.hash(createUserDto.password, salt);
    const { role_ids, ...data } = createUserDto;

    const user = await this.prisma.user.create({
      data: {
        ...data,
        password,
        id: uuid(),
        roles: {
          connect: role_ids?.map((roleId) => ({
            id: roleId,
          })),
        },
      },
    });
    return new UserResponse(user);
  }

  async findAll(
    query: UserQuery,
    pagination: PaginationQuery,
  ): Promise<PaginationData<UserResponse> & { records: UserResponse[] }> {
    const { skip, take } = pagination;
    const records = await this.prisma.user
      .findMany({
        skip,
        take,
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
    const { role_ids, ...data } = updateUserDto;
    const user = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        ...data,
        update_at: new Date(),
        roles: {
          connect: role_ids?.map((roleId) => ({
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
