import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninRequest, SigninResponse } from './dto/signin.dto';
import { SignupRequest, SignupResponse } from './dto/signup.dto';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, LocalAuthGuard } from '@/common/guards/auth.guard';
import { Request } from 'express';

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
  // @UseGuards(LocalAuthGuard)
  async signin(@Req() req: Request, @Body() body: SigninRequest) {
    // return { success: true };
    const user = await this.authService.verifyUser(body.email, body.password);
    // console.log('🚀 ~ AuthController ~ signin ~ user:', user);
    req.logIn(user, (err) => {
      if (err) {
        throw new BadRequestException('登录失败');
      }
    });
    return {
      success: true,
    };
  }

  @ApiOperation({
    summary: 'session 身份验证',
  })
  @Post('signin/session')
  @UseGuards(LocalAuthGuard)
  signinWithSession() {
    return {
      success: true,
    };
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '登出',
  })
  @Post('signout')
  signout() {
    return this.authService.signout();
  }
}
