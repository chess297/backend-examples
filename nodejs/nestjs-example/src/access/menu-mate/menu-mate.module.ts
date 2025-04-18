import { Module } from '@nestjs/common';
import { MenuMateController } from './menu-mate.controller';
import { MenuMateService } from './menu-mate.service';

@Module({
  controllers: [MenuMateController],
  providers: [MenuMateService],
})
export class MenuMateModule {}
