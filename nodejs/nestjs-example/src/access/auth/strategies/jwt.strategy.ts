import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { JwtPayload } from '@/common/guards/auth.guard';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwt.secret') ?? '',
    });
  }
  // 能来到这里的，证明jwt没有过期
  validate(payload: JwtPayload) {
    console.log('🚀 ~ JwtStrategy ~ validate ~ payload:', payload);
    // return { user_id: payload.sub, username: payload.username };
    return true;
  }
}
