import { Inject, Injectable, Logger } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
// import Redis from 'ioredis';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from '@/database/prisma.service';
// import { InjectRedis } from '@nestjs-modules/ioredis';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import dayjs from 'dayjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskTypeOrmRepository: Repository<Task>,
    @Inject(CACHE_MANAGER) private cache: Cache,
    // @InjectRedis() private readonly redis: Redis,
    private prisma: PrismaService,
    private readonly logger: Logger,
  ) {}

  get taskRepository() {
    return this.prisma.$extends({
      result: {
        tasks: {
          createAt: {
            needs: { createAt: true },
            compute(data) {
              return dayjs(data.createAt).format();
            },
          },
          updateAt: {
            needs: { updateAt: true },
            compute(data) {
              return dayjs(data.updateAt).format();
            },
          },
        },
      },
    });
  }
  create(createTaskDto: CreateTaskDto) {
    return this.taskTypeOrmRepository.insert({
      id: uuid(),
      title: createTaskDto.title,
      description: createTaskDto.description,
    });
  }
  async findAll() {
    // const list = await this.taskRepository.tasks.findMany();
    // return list;
    const list = await this.taskTypeOrmRepository.find().catch((e) => {
      this.logger.error(e);
      return [];
    });
    return list;
  }

  findOne(id: string) {
    return this.prisma.tasks.findFirst({
      where: {
        id,
      },
    });
  }

  update(id: string, updateTaskDto: UpdateTaskDto) {
    return this.prisma.tasks.update({
      where: {
        id,
      },
      data: {
        ...updateTaskDto,
        updateAt: new Date(),
      },
    });
  }

  remove(id: string) {
    return this.prisma.tasks.delete({
      where: {
        id,
      },
    });
  }
}
