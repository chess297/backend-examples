import { v4 as uuid } from 'uuid';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma/prisma.service';
import {
  CreateTaskRequest,
  FindTaskQuery,
  FindTaskResponse,
} from './dto/create-task.dto';
import { UpdateTaskRequest } from './dto/update-task.dto';
import { Task } from './entities/task.entity';

@Injectable()
export class TaskService {
  constructor(
    @Inject(CACHE_MANAGER)
    private prisma: PrismaService,
  ) {}

  async create(createTaskDto: CreateTaskRequest) {
    const id = uuid();
    const task = await this.prisma.task.create({
      omit: {
        delete_at: true,
      },
      data: {
        id,
        creator_id: createTaskDto.creator,
        title: createTaskDto.title,
        description: createTaskDto.description,
      },
    });

    return task;
  }
  async findAll(query: FindTaskQuery): Promise<FindTaskResponse> {
    const { page = 0, limit = 10, creator, ...where } = query;
    // prisma
    const skip = +page * +limit;
    const take = +limit;
    const records = await this.prisma.task.findMany({
      skip,
      take,
      where: { ...where, creator_id: creator },
    });
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
    // const task = await this.taskRepo.findOneBy({ id });
    const task = this.prisma.task.findUnique({
      where: {
        id,
      },
      include: {
        creator: true,
      },
    });
    return task;
  }

  update(id: string, updateTaskDto: UpdateTaskRequest) {
    // return this.taskRepo.update(id, {
    //   ...updateTaskDto,
    //   update_at: new Date(),
    // });
    const { creator, ...data } = updateTaskDto;
    return this.prisma.task.update({
      where: {
        id,
      },
      data: {
        ...data,
        update_at: new Date(),
        creator: {
          connect: {
            id: creator,
          },
        },
      },
    });
  }

  remove(id: string) {
    // return this.taskRepo.softRemove({ id }).catch((e) => {
    //   this.logger.error(e);
    // });
    return this.prisma.task.delete({
      where: {
        id,
      },
    });
  }

  async findUserTasks(creator_id: string) {
    const records = await this.prisma.task.findMany({
      where: {
        creator_id,
      },
    });
    return new FindTaskResponse({
      records,
      total: records.length,
    });
  }
}
