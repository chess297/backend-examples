import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma';
import { getDBUrl } from 'src/common/config/config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      datasourceUrl: getDBUrl(),
    });
  }
  async onModuleInit() {
    await this.$connect();
  }
}
