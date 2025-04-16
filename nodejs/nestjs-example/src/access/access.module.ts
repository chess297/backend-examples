import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PermissionModule } from './permission/permission.module';
import { RoleModule } from './role/role.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [AuthModule, RoleModule, PermissionModule, UserModule],
})
export class AccessModule {}
