import { Module } from '@nestjs/common';
import { DictionaryModule } from '@/modules/dictionary/dictionary.module';
import { MenuGroupController } from './menu-group.controller';
import { MenuGroupService } from './menu-group.service';

@Module({
  imports: [DictionaryModule],
  controllers: [MenuGroupController],
  providers: [MenuGroupService],
  exports: [MenuGroupService],
})
export class MenuGroupModule {}
