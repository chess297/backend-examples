import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { SigninRequest } from './dto/signin.dto';
import { SignupRequest } from './dto/signup.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from '@/common/guards/auth.guard';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async signin(dto: SigninRequest) {
    const user = await this.userService.findOneByName(dto.name);

    if (!user) {
      throw new BadRequestException('用户不存在');
    }

    const isValid = await this.verifyPassword(
      dto.password,
      user.password,
    ).catch(() => {
      throw new BadRequestException('用户名或密码错误');
    });
    if (isValid) {
      const payload: JwtPayload = { username: user.name, userId: user.id };
      return {
        access_token: this.jwtService.sign(payload),
      };
    }

    return dto;
  }

  signup(dto: SignupRequest) {
    return this.userService.create(dto);
  }
  // 登出
  signout() {
    return 'sign out';
  }

  verifyPassword(password: string, hash: string) {
    // 这里可以使用 bcrypt 库进行密码验证
    return bcrypt.compare(password, hash);
  }
}
