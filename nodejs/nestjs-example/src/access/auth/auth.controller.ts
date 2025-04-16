import { Request, Response } from 'express';
import { Controller, Post, Body, Req, Res } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { APP_NAME } from '@/constants';
import { AuthService } from './auth.service';
import { SigninRequest, SigninResponse } from './dto/signin.dto';
import { SignupRequest, SignupResponse } from './dto/signup.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: '注册',
    operationId: 'signup',
  })
  @Post('signup')
  @ApiOkResponse({
    type: SignupResponse,
  })
  signup(@Body() body: SignupRequest) {
    return this.authService.signup(body);
  }

  @ApiOperation({
    summary: '登录',
    operationId: 'signin',
  })
  @Post('signin')
  @ApiOkResponse({ type: SigninResponse })
  async signin(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() body: SigninRequest,
  ) {
    const user = await this.authService.verifyUser(body.email, body.password);
    req.session.passport = {
      user: user,
    };
    res.cookie('user_id', user.id, {
      httpOnly: false,
    });
    return {
      success: true,
    };
  }

  @ApiOperation({
    summary: '登出',
    operationId: 'signout',
  })
  @Post('signout')
  signout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    this._destroySession(req, res);
    return {
      success: true,
    };
  }

  @ApiOperation({
    summary: '注销用户',
    operationId: 'logout',
  })
  @Post('logout')
  logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    req.session.destroy((err) => console.log(err));
    this._destroySession(req, res);
    return {
      success: true,
    };
  }

  _destroySession(req: Request, res: Response) {
    req.session.destroy((err) => console.log(err));
    res.clearCookie('user_id');
    res.clearCookie(APP_NAME);
  }
}
