import { SESSION_ID_COOKIE_KEY } from '@/constants';
import { SessionGuard } from '@/guards/session.guard';
import { User } from '@/user/entities/user.entity';
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

declare module 'express-session' {
  interface SessionData {
    views: Record<string, string>;
    isLogin: boolean;
    email: string;
  }
}

class SigninRequest {
  @ApiProperty({ example: 'example@example.com' })
  email: string;
  @ApiProperty({
    example: '123456',
  })
  password: string;
}

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly jwtService: JwtService) {}

  @ApiBody({
    type: SigninRequest,
  })
  @Post('signin')
  signin(@Req() req: Request, @Res() res: Response, @Body() body: User) {
    req.session.isLogin = true;
    req.session.email = body.email;
    res.json({
      access_token: '',
    });
  }

  @Post('signup')
  signup() {
    return 'signup';
  }

  @UseGuards(SessionGuard)
  @Post('signout')
  signout(@Req() req: Request, @Res() res: Response) {
    req.session.destroy((err) => {
      if (err) {
        this.logger.error(err);
      }
    });
    res.clearCookie(SESSION_ID_COOKIE_KEY);

    res.json({
      success: true,
    });
  }
}
