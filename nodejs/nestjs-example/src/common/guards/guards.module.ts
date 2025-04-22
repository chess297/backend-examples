import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { SystemInitModule } from '@/system-init/system-init.module';
import { SystemInitGuard } from './system-init.guard';

@Module({
  imports: [
    SystemInitModule, // 导入SystemInitModule以便注入SystemInitService
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: SystemInitGuard,
    },
  ],
})
export class GuardsModule {}
