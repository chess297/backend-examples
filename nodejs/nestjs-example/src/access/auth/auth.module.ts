import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { SessionSerializer } from '@/common/serializer/session.serializer';
import { SessionStrategy } from './strategies/session.strategy';
// import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    UserModule,
    PassportModule.register({
      session: true, // 开启session 序列化和反序列化功能
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      global: true,
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get('jwt.secret'),
          signOptions: { expiresIn: config.get('jwt.expire') },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    SessionSerializer,
    SessionStrategy,
  ],
})
export class AuthModule {}
