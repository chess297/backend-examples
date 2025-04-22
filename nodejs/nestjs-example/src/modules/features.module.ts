import { Module } from '@nestjs/common';
import { AttachmentModule } from './attachment/attachment.module';
import { DictionaryModule } from './dictionary/dictionary.module';
import { TaskModule } from './task/task.module';

@Module({
  imports: [
    DictionaryModule, // 添加字典模块
    AttachmentModule, // 添加附件模块
    TaskModule,
  ],
})
export class FeaturesModule {}
