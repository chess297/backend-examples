import { Module } from '@nestjs/common';
import { ProfileController } from './profile/profile.controller';
import { ProfileModule } from './profile/profile.module';
import { ProfileService } from './profile/profile.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [ProfileModule],
  controllers: [ProfileController, UserController],
  providers: [UserService, ProfileService],
  exports: [UserService],
})
export class UserModule {}
