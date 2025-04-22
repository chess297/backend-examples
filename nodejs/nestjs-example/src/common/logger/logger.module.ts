import { WinstonModule } from 'nest-winston';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerService } from './logger.service';
import { createWinstonLogger } from './winston.config';

@Global()
@Module({
  imports: [
    ConfigModule,
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        createWinstonLogger(configService),
    }),
  ],
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
