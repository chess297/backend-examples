import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { SigninRequest } from './dto/signin.dto';
import { SignupRequest } from './dto/signup.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from '@/common/guards/auth.guard';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import Redis from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    @Inject(CACHE_MANAGER) private cache: Cache,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async signin(dto: SigninRequest) {
    const user = await this.userService.findOneByEmail(dto.email);

    if (!user) {
      throw new BadRequestException('用户名或密码错误');
    }

    const isValid = await this.verifyPassword(
      dto.password,
      user.password,
    ).catch(() => {
      throw new BadRequestException('用户名或密码错误');
    });
    if (isValid) {
      const payload: JwtPayload = {
        name: user.name,
        id: user.id,
        email: user.email,
      };
      const access_token = this.jwtService.sign(payload);
      await this.redis.set(`user:${user.id}:token`, access_token);

      return {
        access_token,
      };
    } else {
      throw new BadRequestException('用户名或密码错误');
    }
  }

  signup(dto: SignupRequest) {
    return this.userService.create(dto);
  }
  // 登出
  signout() {
    return 'sign out';
  }

  async verifyUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findOneByEmail(email);

    if (!user) {
      throw new BadRequestException('用户名或密码错误');
    }

    await this.verifyPassword(password, user.password).catch(() => {
      throw new BadRequestException('用户名或密码错误');
    });
    return user;
  }

  verifyPassword(password: string, hash: string) {
    // 这里可以使用 bcrypt 库进行密码验证
    return bcrypt.compare(password, hash);
  }
}
