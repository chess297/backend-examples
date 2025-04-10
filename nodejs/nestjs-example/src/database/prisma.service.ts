import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/clients/postgresql';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(private readonly config: ConfigService) {
    super({
      datasourceUrl: config.get('db_url'),
    });
  }
  async onModuleInit() {
    await this.$connect();
  }
}
