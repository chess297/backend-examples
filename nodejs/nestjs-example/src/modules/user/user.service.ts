import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateUserRequest } from './dto/create-user.dto';
import { UpdateUserRequest } from './dto/update-user.dto';
import { PrismaService } from '@/database/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { ProfileService } from '../profile/profile.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

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
    return `This action returns all user`;
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    this.logger.log(`user ${user?.name}`);
    return user;
  }

  async findOneByName(name: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        name,
      },
    });
    return user;
  }

  update(id: string, updateUserDto: UpdateUserRequest) {
    return updateUserDto;
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
