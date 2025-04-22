import { Module } from '@nestjs/common';
import { DictionaryModule } from './dictionary/dictionary.module';
import { TaskModule } from './task/task.module';

@Module({
  imports: [
    DictionaryModule, // 添加字典模块

    TaskModule,
  ],
})
export class FeaturesModule {}
