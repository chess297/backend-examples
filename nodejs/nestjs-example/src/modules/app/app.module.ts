import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TaskModule } from '../task/task.module';
import { ConfigModule } from '@nestjs/config';
import config from '@/common/config/config';
import { DatabaseModule } from '@/database/database.module';
import { LoggerModule } from '@/common/logger/logger.module';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { ProfileModule } from '../profile/profile.module';
import { RoleModule } from '../role/role.module';
import { PermissionModule } from '../permission/permission.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
    }),
    LoggerModule,
    DatabaseModule,
    TaskModule,
    AuthModule,
    UserModule,
    ProfileModule,
    RoleModule,
    PermissionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
