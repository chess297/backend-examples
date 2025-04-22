import { Logger, Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';

@Module({
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule {
  private readonly logger = new Logger(RoleModule.name);
  constructor(private readonly roleService: RoleService) {
    // this.__init__().catch((e) => {
    //   this.logger.error(e);
    // });
  }

  private async __init__() {
    const systemAdminRole =
      await this.roleService.findOneByName('system-admin');
    if (systemAdminRole) {
      return;
    }
    return this.roleService.create({
      name: 'system-admin',
      description: '系统管理员',
    });
  }
}
