import { Module } from '@nestjs/common';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    NestCacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          ttl: 10 * 1000, // 10s 缓存
          store: redisStore,
          url: config.get('redis_url'),
        };
      },
    }),
  ],
})
export class CacheModule {}
