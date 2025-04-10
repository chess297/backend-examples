import { Module } from '@nestjs/common';
import { RedisModule } from '@nestjs-modules/ioredis';
import { ConfigService } from '@nestjs/config';
import { CacheModule } from './cache/cache.module';
import { PrismaModule } from './prisma/prisma.module';
import { TypeormModule } from './typeorm/typeorm.module';
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
    TypeormModule,
  ],
  providers: [],
  exports: [],
})
export class DatabaseModule {}
