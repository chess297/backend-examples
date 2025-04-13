import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ProfileModule } from '../profile/profile.module';
import { TaskModule } from '../task/task.module';

@Module({
  imports: [ProfileModule, TaskModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
