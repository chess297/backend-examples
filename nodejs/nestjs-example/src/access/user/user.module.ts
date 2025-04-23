import { Module } from '@nestjs/common';
import { CaslModule } from '@/common/casl/casl.module';
import { AttachmentModule } from '@/modules/attachment/attachment.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [CaslModule, AttachmentModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
