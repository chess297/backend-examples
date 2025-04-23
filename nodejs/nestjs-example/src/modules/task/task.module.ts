import { Module } from '@nestjs/common';
import { CaslModule } from '@/common/casl/casl.module';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';

@Module({
  imports: [CaslModule],
  controllers: [TaskController],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule {}
