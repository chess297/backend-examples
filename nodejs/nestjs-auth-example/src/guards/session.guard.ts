import { SESSION_ID_COOKIE_KEY } from '@/constants';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class SessionGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();

    if (!req.session.isLogin) {
      // 如果没有登录，把客户端的cookie清掉
      req.session.destroy((err) => {
        console.log('🚀 ~ SessionGuard ~ req.session.destroy ~ err:', err);
      });
      res.clearCookie(SESSION_ID_COOKIE_KEY);

      throw new UnauthorizedException();
    }

    return !!req.session.isLogin;
  }
}
