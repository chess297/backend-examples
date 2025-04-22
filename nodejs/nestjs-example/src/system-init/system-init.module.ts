import { Module } from '@nestjs/common';
import { SystemInitController } from './system-init.controller';
import { SystemInitService } from './system-init.service';

@Module({
  controllers: [SystemInitController],
  providers: [SystemInitService],
  exports: [SystemInitService],
})
export class SystemInitModule {}
