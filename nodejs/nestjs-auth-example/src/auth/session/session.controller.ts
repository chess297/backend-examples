import { RequestWithUser } from '@/user/entities/user.entity';
import { Controller, Get, Post, Req } from '@nestjs/common';

@Controller('session')
export class SessionController {
  @Get()
  getHello(): string {
    return 'Hello World!';
  }

  @Post('/pass')
  login(@Req() req: RequestWithUser) {
    return req.user;
  }

  @Post('/not-pass')
  logout() {
    return 'logout';
  }
}
