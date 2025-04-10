import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateUserRequest, GetUserResponse } from './dto/create-user.dto';
import { PrismaService } from '@/database/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { ProfileService } from '../profile/profile.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { UpdateUserRequest } from './dto/update-user.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly profileService: ProfileService,
  ) {}
  async create(createUserDto: CreateUserRequest) {
    // 处理密码
    const salt = await bcrypt.genSalt();
    const password = await bcrypt.hash(createUserDto.password, salt);
    // 处理邮箱
    const email = createUserDto.email;
    const [localPart, domain] = email.split('@');
    const id = uuid();
    const data = {
      name: createUserDto.name,
      password: password,
      id,
      localPart,
      domain,
    };

    const user = await this.prisma.user
      .create({
        data: data,
      })
      .catch((err: PrismaClientKnownRequestError) => {
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
    if (user) {
      await this.profileService.create({
        userId: user.id,
      });
      return { id: user.id };
    }
    throw new BadRequestException('注册失败');
  }

  findAll() {
    return this.prisma.user
      .findMany({
        where: {
          deleteAt: null,
        },
        omit: {
          deleteAt: true,
          password: true,
        },
      })
      .then((list) => {
        return list.map(
          (item) =>
            new GetUserResponse({
              ...item,
              email: `${item.localPart}@${item.domain}`,
            }),
        );
      });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      omit: {
        deleteAt: true,
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

  async findOneByName(name: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        name,
      },
    });
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
        name: data.name,
        localPart: data.localPart?.toString(),
        domain: data.domain?.toString(),
        updateAt: new Date(),
      },
    });
    return user;
  }

  async remove(id: string) {
    // 删除用户前要先把用户信息删除
    // 删除用户信息
    await this.profileService.remove(id);
    // 删除用户
    await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        deleteAt: new Date(),
      },
    });

    return null;
  }

  async removeMany(ids: string[]) {
    for (const id of ids) {
      await this.profileService.remove(id);
      await this.prisma.user.update({
        where: {
          id,
        },
        data: {
          deleteAt: new Date(),
        },
      });
    }
    return null;
  }
}
