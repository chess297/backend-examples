import { LocalAuthGuard } from '@/guards/auth.guard';
import { RequestWithUser } from '@/user/entities/user.entity';
import { Controller, Post, Req, UseGuards } from '@nestjs/common';

@Controller('local')
export class LocalController {
  @UseGuards(LocalAuthGuard)
  @Post('/pass')
  login(@Req() req: RequestWithUser) {
    return req.user;
  }

  @UseGuards(LocalAuthGuard)
  @Post('/not-pass')
  logout() {
    return 'logout';
  }
}
