import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ConfigService } from '@nestjs/config';
import dayjs from 'dayjs';
@Global()
@Module({
  imports: [],
  providers: [
    {
      provide: PrismaService,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const prisma = new PrismaService(config).$extends({
          result: {
            task: {
              createAt: {
                needs: { createAt: true },
                compute(data) {
                  return dayjs(data.createAt).format();
                },
              },
              updateAt: {
                needs: { updateAt: true },
                compute(data) {
                  return dayjs(data.updateAt).format();
                },
              },
            },
          },
        });
        return prisma;
      },
    },
  ],
  exports: [PrismaService],
})
export class PrismaModule {}
