import { Strategy } from 'passport-local';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { UserEntity } from '@/access/user/entities/user.entity';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  // local strategy 内部只会单纯的校验body中是否存在校验的这两个值，不存在直接响应鉴权失败，连这里都不会进
  async validate(
    email: string,
    password: string,
  ): Promise<Omit<UserEntity, 'password'>> {
    const user = await this.authService.verifyUser(email, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
