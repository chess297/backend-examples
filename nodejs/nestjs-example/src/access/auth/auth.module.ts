import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { SessionSerializer } from '@/access/auth/session/session.serializer';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SessionStrategy } from './session/session.strategy';

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
  providers: [AuthService, SessionSerializer, SessionStrategy],
})
export class AuthModule {}
