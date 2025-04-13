import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import Redis from 'ioredis';
import { RedisStore } from 'connect-redis';
const SESSION_MAX_AGE = 60 * 1000;
const APP_NAME = 'nestjs-session-example';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const redis = new Redis({
    password: 'backend-examples',
  });
  const store = new RedisStore({
    client: redis,
    prefix: `${APP_NAME}:`,
  });
  app.setGlobalPrefix('/api/v1');
  app.use(
    session({
      store,
      secret: APP_NAME,
      name: APP_NAME,
      resave: true,
      saveUninitialized: true,
      cookie: {
        httpOnly: true,
        // secure: true,
        maxAge: SESSION_MAX_AGE, // 设置cookie的过期时间
      },
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
