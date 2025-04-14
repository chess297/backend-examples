import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { User } from '@/user/entities/user.entity';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly authService: AuthService) {
    super();
  }
  serializeUser(
    user: User,
    done: (err: Error | null, user: User) => void,
  ): void {
    console.log('🚀 ~ AuthSerializer ~ user:', user);
    done(null, user);
  }
  deserializeUser(
    payload: User,
    done: (err: Error | null, payload: User) => void,
  ): void {
    console.log('🚀 ~ AuthSerializer ~ payload:', payload);
    done(null, payload);
  }
}
