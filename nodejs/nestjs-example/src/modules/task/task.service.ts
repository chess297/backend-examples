import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import Redis from 'ioredis';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from '../../database/prisma.service';
import { InjectRedis } from '@nestjs-modules/ioredis';

@Injectable()
export class TaskService {
  constructor(
    @InjectRedis() private readonly redis: Redis,
    private prisma: PrismaService,
  ) {}
  create(createTaskDto: CreateTaskDto) {
    const now = new Date();
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
