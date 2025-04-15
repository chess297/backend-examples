import { UserEntity } from '@/access/user/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';

declare module 'express-session' {
  interface SessionData {
    passport: {
      user: UserEntity;
    };
  }
}

@Injectable()
export class SessionSerializer extends PassportSerializer {
  serializeUser(
    user: UserEntity,
    done: (err: Error | null, user: UserEntity) => void,
  ): void {
    console.log('🚀 ~ SessionSerializer ~ user:', user);
    done(null, user);
  }
  deserializeUser(
    payload: UserEntity,
    done: (err: Error | null, payload: UserEntity) => void,
  ): void {
    console.log('🚀 ~ SessionSerializer ~ payload:', payload);
    done(null, payload);
  }
}
