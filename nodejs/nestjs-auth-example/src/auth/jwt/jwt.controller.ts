import { JwtAuthGuard } from '@/guards/auth.guard';
import { RequestWithUser } from '@/user/entities/user.entity';
import { Controller, Post, Req, UseGuards } from '@nestjs/common';

@Controller('jwt')
export class JwtController {
  @UseGuards(JwtAuthGuard)
  @Post('/pass')
  login(@Req() req: RequestWithUser) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('/not-pass')
  logout() {
    return 'logout';
  }
}
