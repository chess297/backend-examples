import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninRequest } from './dto/signin.dto';
import { SignupRequest } from './dto/signup.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * @remarks 注册用户
   */
  @Post('signup')
  signup(@Body() body: SignupRequest) {
    return this.authService.signup(body);
  }

  /**
   * 登录
   */
  @Post('signin')
  signin(@Body() body: SigninRequest) {
    return this.authService.signin(body);
  }

  @Post('signout')
  signout() {
    return this.authService.signout();
  }
}
