import dayjs from 'dayjs';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from './prisma.service';

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
              create_at: {
                needs: { create_at: true },
                compute(data) {
                  return dayjs(data.create_at).format();
                },
              },
              update_at: {
                needs: { update_at: true },
                compute(data) {
                  return dayjs(data.update_at).format();
                },
              },
              delete_at: {
                needs: { delete_at: true },
                compute(data) {
                  return dayjs(data.delete_at).format();
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
