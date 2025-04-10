import { Task } from '@/modules/task/entities/task.entity';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule as NestTypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [
    NestTypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        url: config.get('mysql_url'),
        entities: [Task],
        logger: 'debug',
      }),
    }),
  ],
})
export class TypeormModule {}
