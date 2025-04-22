import { Module } from '@nestjs/common';
import { AttachmentModule } from '@/modules/attachment/attachment.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [AttachmentModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
