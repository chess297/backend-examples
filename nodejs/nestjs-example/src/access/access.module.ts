import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MenuGroupModule } from './menu-group/menu-group.module';
import { MenuModule } from './menu/menu.module';
import { PermissionModule } from './permission/permission.module';
import { RoleModule } from './role/role.module';
import { SystemInitModule } from './system-init/system-init.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    AuthModule,
    RoleModule,
    PermissionModule,
    UserModule,
    MenuModule,
    MenuGroupModule,
    SystemInitModule, // 添加系统初始化模块
  ],
})
export class AccessModule {}
