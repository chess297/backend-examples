import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninRequest, SigninResponse } from './dto/signin.dto';
import { SignupRequest, SignupResponse } from './dto/signup.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SwaggerErr, SwaggerOk } from '@/common/decorators/swagger.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: '注册',
  })
  @Post('signup')
  @SwaggerOk(SignupResponse)
  @SwaggerErr(400)
  signup(@Body() body: SignupRequest) {
    return this.authService.signup(body);
  }

  @ApiOperation({
    summary: '登录',
  })
  @Post('signin')
  @SwaggerOk(SigninResponse)
  @SwaggerErr(400)
  signin(@Body() body: SigninRequest) {
    return this.authService.signin(body);
  }

  @ApiOperation({
    summary: '登出',
  })
  @Post('signout')
  signout() {
    return this.authService.signout();
  }
}
