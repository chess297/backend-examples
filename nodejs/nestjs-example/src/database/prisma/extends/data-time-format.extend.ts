import { PrismaClient } from '@prisma/clients/postgresql';
import dayjs from 'dayjs';

export function dataTimeFormatExtend(prisma: PrismaClient) {
  const client = prisma.$extends({
    result: {
      tasks: {
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
  return client;
}
