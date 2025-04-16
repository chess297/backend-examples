import { Request } from 'express';
import { Observable } from 'rxjs';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserEntity } from '@/access/user/entities/user.entity';
import { PERMISSION_KEY } from '@/common/decorators/permission.decorator';
import { Action } from '@/constants/enums/action.enum';

declare module 'express' {
  interface Request {
    user: Omit<UserEntity, 'password'>;
    permissions: string[];
  }
}

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const classPermissions = this.reflector.get<string[]>(
      PERMISSION_KEY,
      context.getClass(),
    );

    const funcPermissions = this.reflector.get<string[]>(
      PERMISSION_KEY,
      context.getHandler(),
    );
    if (classPermissions) {
      const req = context.switchToHttp().getRequest<Request>();
      const permissions: string[] = [];

      // permissions.push(...classPermission);
      classPermissions.forEach((permission) => {
        // permissions.push(permission);
        if (funcPermissions) {
          funcPermissions.forEach((funcPermission) => {
            permissions.push(`${permission}:${funcPermission}`);
          });
        } else {
          permissions.push(
            `${permission}:${Action.Manage.toLocaleLowerCase()}`,
          );
        }
      });
      req.permissions = permissions;
      console.log('🚀 ~ PermissionGuard ~ permissions:', permissions);
    }

    return true;
  }
}
