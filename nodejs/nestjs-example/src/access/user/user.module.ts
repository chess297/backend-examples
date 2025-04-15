import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ProfileModule } from './profile/profile.module';
import { ProfileController } from './profile/profile.controller';
import { ProfileService } from './profile/profile.service';

@Module({
  imports: [ProfileModule],
  controllers: [ProfileController, UserController],
  providers: [UserService, ProfileService],
  exports: [UserService],
})
export class UserModule {}
