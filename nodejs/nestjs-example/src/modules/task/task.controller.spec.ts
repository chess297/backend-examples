import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { ConfigModule } from '@nestjs/config';
import config from '@/config';
import { DatabaseModule } from '@/database/database.module';
import { LoggerModule } from '@/common/logger/logger.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';

describe('TaskController', () => {
  let controller: TaskController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [config],
          isGlobal: true,
        }),
        DatabaseModule,
        LoggerModule,
        TypeOrmModule.forFeature([Task]),
      ],
      controllers: [TaskController],
      providers: [TaskService],
    }).compile();

    controller = module.get<TaskController>(TaskController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
