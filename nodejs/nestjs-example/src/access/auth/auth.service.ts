import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { SigninRequest } from './dto/signin.dto';
import { SignupRequest } from './dto/signup.dto';
import { SessionSerializer } from './session/session.serializer';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly sessionSerializer: SessionSerializer,
  ) {}

  async signin(dto: SigninRequest) {
    const user = await this.verifyUser(dto.email, dto.password);
    return this.sessionSerializer.serializeUser(user);
  }

  signup(dto: SignupRequest) {
    return this.userService.create({
      ...dto,
      phone: '',
      address: '',
      country_code: '',
      is_active: true,
      avatar_url: null,
    });
  }

  async verifyUser(
    email: string,
    pwd: string,
  ): Promise<Omit<UserEntity, 'password'>> {
    const user = await this.userService.findOneByEmail(email);

    if (!user) {
      throw new BadRequestException('邮箱不存在');
    }

    const isValid = await this.verifyPassword(pwd, user.password);
    if (!isValid) {
      throw new BadRequestException('邮箱或密码错误');
    }
    const { password, ...res } = user;
    return res;
  }

  verifyPassword(password: string, hash: string) {
    // 这里可以使用 bcrypt 库进行密码验证
    return bcrypt.compare(password, hash);
  }
}
