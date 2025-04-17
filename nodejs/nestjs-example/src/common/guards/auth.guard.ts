import { Request } from 'express';
import { Observable } from 'rxjs';
import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // throw new Error('Method not implemented.');
    const req = context.switchToHttp().getRequest<Request>();
    if (!req.session.passport?.user) {
      throw new UnauthorizedException('请先登录');
    }
    return true;
  }
}
