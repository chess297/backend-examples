import { Module } from '@nestjs/common';
import { PrismaService } from '@/database/prisma/prisma.service';
import { CaslAbilityFactory } from './casl-ability.factory';
import { CaslHelperService } from './casl-helper.service';

@Module({
  providers: [CaslAbilityFactory, CaslHelperService, PrismaService],
  exports: [CaslAbilityFactory, CaslHelperService],
})
export class CaslModule {}
