import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ConfigService } from '@nestjs/config';
import { dataTimeFormatExtend } from './extends/data-time-format.extend';
@Global()
@Module({
  imports: [],
  providers: [
    {
      provide: PrismaService,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const prisma = new PrismaService(config);
        return dataTimeFormatExtend(prisma);
      },
    },
  ],
  exports: [PrismaService],
})
export class PrismaModule {}
