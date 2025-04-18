import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MenuGroupModule } from './menu-group/menu-group.module';
import { MenuMateModule } from './menu-mate/menu-mate.module';
import { MenuModule } from './menu/menu.module';
import { PermissionModule } from './permission/permission.module';
import { RoleModule } from './role/role.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    AuthModule,
    RoleModule,
    PermissionModule,
    UserModule,
    MenuModule,
    MenuMateModule,
    MenuGroupModule,
  ],
})
export class AccessModule {}
