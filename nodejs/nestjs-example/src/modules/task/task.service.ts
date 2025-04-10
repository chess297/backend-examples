import { Inject, Injectable, Logger } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
// import Redis from 'ioredis';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from '../../database/prisma.service';
// import { InjectRedis } from '@nestjs-modules/ioredis';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class TaskService {
  constructor(
    @Inject(CACHE_MANAGER) private cache: Cache,
    // @InjectRedis() private readonly redis: Redis,
    private prisma: PrismaService,
    private readonly logger: Logger,
  ) {}
  create(createTaskDto: CreateTaskDto) {
    const now = Date.now().toLocaleString();
    return this.prisma.tasks.create({
      data: {
        ...createTaskDto,
        task_id: uuid(),
        create_at: now,
        update_at: now,
      },
    });
  }
  async findAll() {
    const list = await this.prisma.tasks.findMany();
    // await this.cache.set('list', list, 1000 * 60 * 60 * 24);
    return list;
  }

  findOne(id: number) {
    return `This action returns a #${id} task`;
  }

  update(id: string, updateTaskDto: UpdateTaskDto) {
    return this.prisma.tasks.update({
      where: {
        task_id: id,
      },
      data: {
        ...updateTaskDto,
        update_at: new Date(),
      },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }
}
