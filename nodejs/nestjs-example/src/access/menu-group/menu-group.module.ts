import { Module } from '@nestjs/common';
import { MenuGroupController } from './menu-group.controller';
import { MenuGroupService } from './menu-group.service';

@Module({
  controllers: [MenuGroupController],
  providers: [MenuGroupService],
})
export class MenuGroupModule {}
