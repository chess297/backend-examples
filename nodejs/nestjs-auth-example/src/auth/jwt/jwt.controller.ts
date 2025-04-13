// import { JwtAuthGuard, MyAuthGuard } from '@/guards/auth.guard';
import { MyAuthGuard } from '@/guards/auth.guard';
import { RequestWithUser } from '@/user/entities/user.entity';
import { Controller, Post, Req, UseGuards } from '@nestjs/common';

@Controller('jwt')
export class JwtController {
  // @UseGuards(JwtAuthGuard)
  @UseGuards(MyAuthGuard)
  @Post('/pass')
  login(@Req() req: RequestWithUser) {
    return req.user;
  }

  // @UseGuards(JwtAuthGuard)
  @UseGuards(MyAuthGuard)
  @Post('/not-pass')
  logout() {
    return 'logout';
  }
}
