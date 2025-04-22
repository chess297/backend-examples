import { Request, Response } from 'express';
import { Controller, Post, Body, Req, Res } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '@/common/decorators/public.decorator';
import {
  APIBadRequestResponse,
  APIOkResponse,
} from '@/common/decorators/swagger.decorator';
import { APP_NAME } from '@/constants';
import { PrismaService } from '@/database/prisma/prisma.service';
import { AuthService } from './auth.service';
import { SigninRequest, SigninResponse } from './dto/signin.dto';
import { SignupRequest, SignupResponse } from './dto/signup.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly prisma: PrismaService,
  ) {}

  @ApiOperation({
    summary: '注册',
    operationId: 'signup',
  })
  @ApiOkResponse({
    type: SignupResponse,
  })
  @Public()
  @Post('signup')
  signup(@Body() body: SignupRequest) {
    return this.authService.signup(body);
  }

  @ApiOperation({
    summary: '登录',
    operationId: 'signin',
  })
  @APIOkResponse(SigninResponse)
  @APIBadRequestResponse()
  @Public()
  @Post('signin')
  async signin(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() body: SigninRequest,
  ) {
    const user = await this.authService.verifyUser(body.email, body.password);
    const permissions: string[] =
      user.roles?.reduce((acc, role) => {
        if (role.permissions?.length === 0) {
          return acc;
        }
        const permission =
          role.permissions?.reduce((a, b) => {
            const strArr = b.actions.map((item) => `${b.resource}:${item}`);
            return [...a, ...strArr];
          }, []) ?? [];
        return [...acc, ...permission];
      }, []) ?? [];
    const is_admin = !!user.roles?.some((role) => role.name === 'system-admin');
    delete user.roles;
    req.session.passport = {
      user: user,
      permissions,
      is_admin,
    };

    res.cookie('user_id', user.id, {
      httpOnly: false,
    });

    // 返回扩展的响应体
    return {
      user_id: user.id,
      email: user.email,
      username: user.username,
      is_admin,
      permissions,
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
