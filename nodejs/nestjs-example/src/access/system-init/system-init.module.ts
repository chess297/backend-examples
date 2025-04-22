import { Module } from '@nestjs/common';
import { DictionaryModule } from '@/modules/dictionary/dictionary.module';
import { SystemInitController } from './system-init.controller';
import { SystemInitService } from './system-init.service';

@Module({
  imports: [DictionaryModule],
  controllers: [SystemInitController],
  providers: [SystemInitService],
  exports: [SystemInitService],
})
export class SystemInitModule {}
