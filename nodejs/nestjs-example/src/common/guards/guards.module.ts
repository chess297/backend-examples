import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { SystemInitModule } from '@/access/system-init/system-init.module';
import { AuthGuard } from './auth.guard';
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
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class GuardsModule {}
