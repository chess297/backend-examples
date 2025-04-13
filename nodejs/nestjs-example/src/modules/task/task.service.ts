import { Inject, Injectable, Logger } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
// import Redis from 'ioredis';
import { CreateTaskRequest, FindTaskResponse } from './dto/create-task.dto';
import { UpdateTaskRequest } from './dto/update-task.dto';
import { PrismaService } from '@/database/prisma/prisma.service';
// import { InjectRedis } from '@nestjs-modules/ioredis';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepo: Repository<Task>,
    @Inject(CACHE_MANAGER) private cache: Cache,
    // @InjectRedis() private readonly redis: Redis,
    private prisma: PrismaService,
    private readonly logger: Logger,
  ) {}

  async create(createTaskDto: CreateTaskRequest) {
    // const user = await this.prisma.user.findUnique({
    //   where: {
    //     id: createTaskDto.user_id,
    //   },
    // });
    const id = uuid();
    const task = await this.prisma.task.create({
      data: {
        id,
        user_id: createTaskDto.user_id,
        title: createTaskDto.title,
        description: createTaskDto.description,
      },
    });
    // const task = await this.taskRepo.save({
    //   id: uuid(),
    //   title: createTaskDto.title,
    //   description: createTaskDto.description,
    // });
    return task;
  }
  async findAll(): Promise<FindTaskResponse> {
    // prisma
    const records = await this.prisma.task.findMany();
    // mysql
    // const records = await this.taskRepo.find();
    // await new Promise((resolve) => {
    //   setTimeout(resolve, 3000);
    // });
    return new FindTaskResponse({
      records,
      total: records.length,
    });
  }

  async findOne(id: string) {
    const task = await this.taskRepo.findOneBy({ id });
    // const task = this.prisma.tasks.findUnique({
    //   where: {
    //     id,
    //   },
    // });
    return task;
  }

  update(id: string, updateTaskDto: UpdateTaskRequest) {
    return this.taskRepo.update(id, {
      ...updateTaskDto,
      update_at: new Date(),
    });
    // return this.prisma.tasks.update({
    //   where: {
    //     id,
    //   },
    //   data: {
    //     ...updateTaskDto,
    //     update_at: new Date(),
    //   },
    // });
  }

  remove(id: string) {
    return this.taskRepo.softRemove({ id }).catch((e) => {
      this.logger.error(e);
    });
    // return this.prisma.tasks.delete({
    //   where: {
    //     id,
    //   },
    // });
  }

  async findUserTasks(user_id: string) {
    const records = await this.prisma.task.findMany({
      where: {
        user_id,
      },
    });
    return new FindTaskResponse({
      records,
      total: records.length,
    });
  }
}
