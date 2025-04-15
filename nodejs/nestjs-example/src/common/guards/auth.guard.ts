import { UserEntity } from '@/access/user/entities/user.entity';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

export interface RequestWithUser extends Request {
  user: JwtPayload;
}

export type JwtPayload = Omit<UserEntity, 'password'>;

// 校验请求头中的jwt鉴权，并且将jwt解析出来的信息赋值到request中
@Injectable()
export class ParserJwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();

    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Token not found');
    }
    try {
      const payload: JwtPayload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('jwt.secret'),
      });
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

// 单纯的请求体字段校验
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  constructor() {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const result: boolean = (await super.canActivate(context)) as boolean;
    await super.logIn(context.switchToHttp().getRequest());
    const req = context.switchToHttp().getRequest<RequestWithUser>();
    const user = req.user;
    console.log('🚀 ~ LocalAuthGuard ~ canActivate ~ user:', user);
    if (!user) {
      throw new UnauthorizedException();
    }
    return result;
  }
}

// 单纯的jwt校验，无法将payload往后传递
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
