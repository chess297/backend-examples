import { Request } from 'express';
import { Controller, Post, Body, Req } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SigninRequest, SigninResponse } from './dto/signin.dto';
import { SignupRequest, SignupResponse } from './dto/signup.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: '注册',
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
  })
  @Post('signin')
  @ApiOkResponse({ type: SigninResponse })
  async signin(@Req() req: Request, @Body() body: SigninRequest) {
    const user = await this.authService.verifyUser(body.email, body.password);
    req.session.passport = {
      user: user,
    };
    return {
      success: true,
    };
  }

  @ApiOperation({
    summary: 'session 身份验证',
  })
  @Post('signin/session')
  signinWithSession() {
    return {
      success: true,
    };
  }

  @ApiOperation({
    summary: '登出',
  })
  @Post('signout')
  signout() {
    return this.authService.signout();
  }
}
