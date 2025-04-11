import { Injectable, Logger } from '@nestjs/common';
import { CreateUserRequest } from './dto/create-user.dto';
import { UpdateUserRequest } from './dto/update-user.dto';
import { PrismaService } from '@/database/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(private readonly prisma: PrismaService) {}
  async create(createUserDto: CreateUserRequest) {
    // 处理密码
    const salt = await bcrypt.genSalt();
    const password = await bcrypt.hash(createUserDto.password, salt);
    // 处理邮箱
    const email = createUserDto.email;
    const [local_part, domain] = email.split('@');
    const data = {
      name: createUserDto.name,
      password: password,
      id: uuid(),
      local_part,
      domain,
    };

    const user = await this.prisma.user
      .create({
        data: data,
      })
      .catch((err) => {
        this.logger.error(err);
        throw new Error('创建用户失败');
      });
    return user;
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async findOneByName(name: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        name,
      },
    });
    return user;
  }

  update(id: number, updateUserDto: UpdateUserRequest) {
    return updateUserDto;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
