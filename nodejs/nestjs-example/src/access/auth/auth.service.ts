import { InjectRedis } from '@nestjs-modules/ioredis';
import * as bcrypt from 'bcrypt';
import { Cache } from 'cache-manager';
import Redis from 'ioredis';
// import { JwtPayload } from '@/common/guards/auth.guard';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
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

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    @Inject(CACHE_MANAGER) private cache: Cache,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  signin(dto: SigninRequest) {
    return this.verifyUser(dto.email, dto.password);
  }

  signup(dto: SignupRequest) {
    return this.userService.create({
      ...dto,
      phone: '',
      address: '',
      country_code: '',
      is_active: true,
    });
  }
  // 登出
  signout() {
    return 'sign out';
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
