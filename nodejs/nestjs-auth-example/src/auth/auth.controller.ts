import { User } from '@/user/entities/user.entity';
import { Body, Controller, Logger, Post, Req, Session } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

declare module 'express-session' {
  interface SessionData {
    views: Record<string, string>;
  }
}

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly jwtService: JwtService) {}
  @Post('signin')
  signin(@Req() req: Request, @Body() body: User) {
    console.log('🚀 ~ AuthController ~ signin ~ body:', body);
    console.log('🚀 ~ AuthController ~ signout ~ session:', req.sessionID);
    req.session.touch();
    if (req.session.views) req.session.views['email'] = body.email ?? '';
  }

  @Post('signup')
  signup() {
    return 'signup';
  }

  @Post('signout')
  async signout(@Req() req: Request, @Session() session: Record<string, any>) {
    console.log(
      '🚀 ~ AuthController ~ signout ~ req.sessionID:',
      req.sessionID,
    );
    console.log('🚀 ~ AuthController ~ signout ~ session:', session);
    await new Promise((resolve) => {
      req.session.destroy((err) => {
        if (err) {
          this.logger.error(err);
        }
        resolve(true);
      });
    });
    return 'signout';
  }
}
