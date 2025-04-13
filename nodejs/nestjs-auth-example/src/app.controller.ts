import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { User } from './user/entities/user.entity';
import { LocalAuthGuard } from './auth/local-auth.guard';

type RequestWithUser = Request & { user: User };

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Req() req: RequestWithUser) {
    return req.user;
  }

  @UseGuards(LocalAuthGuard)
  @Post('logout')
  logout() {
    return 'logout';
  }
}
