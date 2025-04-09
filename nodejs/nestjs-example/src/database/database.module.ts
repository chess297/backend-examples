import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { RedisModule } from '@nestjs-modules/ioredis';
import config from '../common/config/config';

@Module({
  imports: [
    RedisModule.forRootAsync({
      useFactory: () => {
        const url = config().redis_url;
        // console.log('RedisModule url', url);
        return {
          url: url,
          type: 'single',
        };
      },
    }),
  ],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class DatabaseModule {}
