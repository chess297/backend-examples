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
            user: {
              email: {
                needs: { localPart: true, domain: true },
                compute(data) {
                  return `${data.localPart}@${data.domain}`;
                },
              },
            },
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
              deleteAt: {
                needs: { deleteAt: true },
                compute(data) {
                  return dayjs(data.deleteAt).format();
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
