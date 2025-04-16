import { Request } from 'express';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { SYSTEM_ADMIN_KEY } from '@/common/decorators/role.decorator';

@Injectable()
export class SystemRoleGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();

    if (
      !req.session.passport?.user?.roles?.some(
        (item) => item.name === SYSTEM_ADMIN_KEY,
      )
    ) {
      throw new ForbiddenException(
        'You are not allowed to access this resource',
      );
    }
    return true;
  }
}
