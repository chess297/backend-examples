import { PermissionAction } from '@prisma/client';
import { Request } from 'express';
import { Observable } from 'rxjs';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSION_KEY } from '@/common/decorators/permission.decorator';

declare module 'express' {
  interface Request {
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
      if (req.session.passport?.is_admin) {
        return true;
      }
      // permissions.push(...classPermission);
      classPermissions.forEach((permission) => {
        // permissions.push(permission);
        if (funcPermissions) {
          funcPermissions.forEach((funcPermission) => {
            permissions.push(`${permission}:${funcPermission}`);
          });
        } else {
          permissions.push(
            `${permission}:${PermissionAction.manage.toLocaleLowerCase()}`,
          );
        }
      });
      req.permissions = permissions;
      const userPermissions = req.session.passport?.permissions;
      if (!userPermissions?.some((item) => permissions.includes(item))) {
        throw new ForbiddenException();
      }
    }

    return true;
  }
}
