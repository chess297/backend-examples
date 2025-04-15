import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import config from '@/config';
import { DatabaseModule } from '@/database/database.module';
import { LoggerModule } from '@/common/logger/logger.module';
import { AccessModule } from '@/access/access.module';
import { FeaturesModule } from './modules/features.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
    }),
    LoggerModule,
    DatabaseModule,
    AccessModule,
    FeaturesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
