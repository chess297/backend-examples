import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninRequest, SigninResponse } from './dto/signin.dto';
import { SignupRequest, SignupResponse } from './dto/signup.dto';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from '@/common/guards/auth.guard';
// import { LocalStrategy } from './local.strategy';

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
  @UseGuards(AuthGuard('local'))
  signin(@Body() body: SigninRequest) {
    return this.authService.signin(body);
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
