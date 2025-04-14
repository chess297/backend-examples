import { SESSION_ID_COOKIE_KEY } from '@/constants';
import { LocalAuthGuard } from '@/guards/auth.guard';
import { SessionGuard } from '@/guards/session.guard';
import {
  Body,
  Controller,
  Logger,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiBody, ApiProperty } from '@nestjs/swagger';
import { Request, Response } from 'express';

class SigninRequest {
  @ApiProperty({ example: 'example' })
  username: string;
  @ApiProperty({
    example: 'example',
  })
  password: string;
}

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly jwtService: JwtService) {}

  /**
   * 使用LocalAuthGuard ，用户名密码验证通过之后，
   * 会被passport序列化类SessionSerializer序列化存到session中，所以不需要自己去处理session
   * @returns
   */
  @UseGuards(LocalAuthGuard)
  @ApiBody({
    type: SigninRequest,
  })
  @Post('signin')
  signin(@Res() res: Response) {
    res.cookie('isLogin', '1', { httpOnly: false });
    res.json({
      success: true,
    });
  }

  @Post('signup')
  signup() {
    return 'signup';
  }

  // @UseGuards(SessionAuthGuard)
  @UseGuards(SessionGuard)
  @Post('signout')
  signout(@Req() req: Request, @Body() body: any, @Res() res: Response) {
    console.log('🚀 ~ AuthController ~ signout ~ body:', body);
    // TODO 奇怪怎么退出登录了，会给前端发一个新的cookie？官方说没关系
    // req.logOut({ keepSessionInfo: true }, (err) => {
    //   console.log('🚀 ~ AuthController ~ req.logOut ~ err:', err);
    // });
    req.session.destroy((err) => {
      if (err) {
        this.logger.error(err);
      }
    });
    res.clearCookie(SESSION_ID_COOKIE_KEY);
    res.clearCookie('isLogin');

    res.json({
      success: true,
    });
  }
}
