import { PermissionAction, User } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { UserEntity } from '@/access/user/entities/user.entity';

type PermissionSubject = User;
export type SessionPermission = Map<string, PermissionAction[]>;

type SessionUser = {
  id: string;
  email: string;
  username: string;
  is_admin: boolean;
  permissions: SessionPermission;
};
declare module 'express-session' {
  interface SessionData {
    user: SessionUser;
  }
}

@Injectable()
export class SessionSerializer {
  serializeUser(user: Omit<UserEntity, 'password'>): SessionUser {
    const is_admin = !!user.roles?.some((role) => role.name === 'system-admin');
    const permissions: SessionPermission = new Map();
    if (user.roles && user.roles?.length > 0) {
      for (const role of user.roles) {
        if (role.permissions && role.permissions?.length > 0) {
          for (const permission of role.permissions) {
            if (!permissions.has(permission.resource)) {
              permissions.set(permission.resource, []);
            }
            const p = permissions.get(permission.resource);
            if (p) {
              permission.actions.forEach((action) => {
                p.push(action);
              });
            }
          }
        }
      }
    }
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      is_admin,
      permissions,
    };
  }
  deserializeUser(
    payload: UserEntity,
    done: (err: Error | null, payload: UserEntity) => void,
  ): void {
    console.log('🚀 ~ SessionSerializer ~ payload:', payload);
  }
}
