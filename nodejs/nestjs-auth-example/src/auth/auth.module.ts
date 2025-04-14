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
  providers: [AuthService, LocalStrategy, JwtStrategy, SessionSerializer],
  controllers: [
    LocalController,
    JwtController,
    SessionController,
    AuthController,
  ],
})
export class AuthModule {}
