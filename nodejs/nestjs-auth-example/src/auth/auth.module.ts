import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '@/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local/local.strategy';
import { LocalController } from './local/local.controller';
import { JwtController } from './jwt/jwt.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt/jwt.strategy';
import { JWT_SECRET } from '@/constants';
import { SessionController } from './session/session.controller';
import { AuthController } from './auth.controller';
import { SessionSerializer } from './session/session.serializer';
import { SessionStrategy } from './session/session.strategy';

@Module({
  imports: [
    UserModule,
    PassportModule.register({
      session: true, // 开启session 序列化和反序列化功能
    }),
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [
    AuthService,

    LocalStrategy, // 注册用户名密码认证策略
    JwtStrategy, // 注册jwt策略
    SessionSerializer, // 注册session序列化
    SessionStrategy,
  ],
  controllers: [
    LocalController,
    JwtController,
    SessionController,
    AuthController,
  ],
})
export class AuthModule {}
