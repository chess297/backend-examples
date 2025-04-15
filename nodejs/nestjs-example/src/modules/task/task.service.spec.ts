import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { DatabaseModule } from '@/database/database.module';
import { ConfigModule } from '@nestjs/config';
import config from '@/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { LoggerModule } from '@/common/logger/logger.module';

describe('TaskService', () => {
  let service: TaskService;

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
      providers: [TaskService],
    }).compile();
    service = module.get<TaskService>(TaskService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
