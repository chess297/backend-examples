import * as redisStore from 'cache-manager-redis-store';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    NestCacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          ttl: 60 * 1000, // 10s 缓存
          store: redisStore,
          url: config.get('redis_url'),
        };
      },
    }),
  ],
})
export class CacheModule {}
