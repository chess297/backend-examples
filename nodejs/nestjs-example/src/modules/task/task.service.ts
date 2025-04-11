import { Inject, Injectable, Logger } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
// import Redis from 'ioredis';
import { CreateTaskRequest } from './dto/create-task.dto';
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
    // const task = await this.prisma.tasks.create({
    //   data: {
    //     id: uuid(),
    //     title: createTaskDto.title,
    //     description: createTaskDto.description,
    //   },
    // });
    const task = await this.taskRepo.save({
      id: uuid(),
      title: createTaskDto.title,
      description: createTaskDto.description,
    });
    return task;
  }
  async findAll() {
    // prisma
    // const list = await this.prisma.tasks.findMany();
    // mysql
    const list = this.taskRepo.find();
    return list;
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
      updateAt: new Date(),
    });
    // return this.prisma.tasks.update({
    //   where: {
    //     id,
    //   },
    //   data: {
    //     ...updateTaskDto,
    //     updateAt: new Date(),
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
}
