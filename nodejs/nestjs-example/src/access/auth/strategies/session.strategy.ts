import { UserEntity } from '@/modules/user/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import * as passport from 'passport';

@Injectable()
export class SessionStrategy extends PassportStrategy(
  passport.strategies.SessionStrategy,
) {
  validate(user?: UserEntity): boolean {
    console.log('🚀 ~ validate ~ user:', user);
    return !!user;
  }
}
