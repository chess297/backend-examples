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
// import { JwtPayload } from '@/common/guards/auth.guard';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import Redis from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { UserEntity } from '../user/entities/user.entity';

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
    return this.userService.create(dto);
  }
  // 登出
  signout() {
    return 'sign out';
  }

  async verifyUser(
    email: string,
    password: string,
  ): Promise<Omit<UserEntity, 'password'>> {
    const user = await this.userService.findOneByEmail(email);

    if (!user) {
      throw new BadRequestException('邮箱不存在');
    }

    const isValid = await this.verifyPassword(password, user.password);
    if (!isValid) {
      throw new BadRequestException('邮箱或密码错误');
    }
    return user;
  }

  verifyPassword(password: string, hash: string) {
    // 这里可以使用 bcrypt 库进行密码验证
    return bcrypt.compare(password, hash);
  }
}
