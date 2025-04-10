import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/clients/postgresql';
// import { PrismaClient } from '@prisma/clients/mysql';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(private readonly config: ConfigService) {
    super({
      datasourceUrl: config.get('postgres_url'),
      log: ['query', 'info', 'warn', 'error'],
    });
  }
  async onModuleInit() {
    await this.$connect();
  }
}
