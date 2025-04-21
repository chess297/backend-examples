import * as passport from 'passport';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { UserEntity } from '@/access/user/entities/user.entity';

@Injectable()
export class SessionStrategy extends PassportStrategy(
  passport.strategies.SessionStrategy,
) {
  validate(user?: UserEntity): boolean {
    // console.log('🚀 ~ validate ~ user:', user);
    return !!user;
  }
}
