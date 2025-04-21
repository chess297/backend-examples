import { RedisModule } from '@nestjs-modules/ioredis';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CacheModule } from './cache/cache.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    RedisModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const url = config.get<string>('redis_url');
        return {
          url: url,
          type: 'single',
        };
      },
    }),
    CacheModule,
    PrismaModule,
  ],
  providers: [],
  exports: [],
})
export class DatabaseModule {}
