import { Controller, Get, Post, Req, Session } from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express';
declare module 'express-session' {
  interface SessionData {
    views: Record<string, any>;
  }
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/auth/signin')
  signin(@Req() req: Request, @Session() session: Record<string, any>) {
    console.log('🚀 ~ AppController ~ signin ~ sessionID:', session);
    // req.session.cookie.expires = new Date(Date.now() + 60 * 1000);
    // req.session.touch();

    return 'signin';
  }

  @Post('/auth/signout')
  signout(@Req() req: Request, @Session() session: Record<string, any>) {
    console.log('🚀 ~ AppController ~ signout ~ session:', session);
    console.log('🚀 ~ AppController ~ signin ~ sessionID:', req.sessionID);

    return 'signout';
  }
}
