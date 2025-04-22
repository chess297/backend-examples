import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AccessModule } from '@/access/access.module';
import { GuardsModule } from '@/common/guards/guards.module';
import { InterceptorsModule } from '@/common/interceptors/interceptors.module';
import { LoggerModule } from '@/common/logger/logger.module';
import { ServicesModule } from '@/common/services/services.module';
import { getConfig } from '@/config';
import { DatabaseModule } from '@/database/database.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FeaturesModule } from './modules/features.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [getConfig],
      isGlobal: true,
    }),
    LoggerModule,
    DatabaseModule,
    ServicesModule,
    InterceptorsModule, // 新增拦截器模块
    GuardsModule, // 新增守卫模块
    AccessModule,
    FeaturesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
