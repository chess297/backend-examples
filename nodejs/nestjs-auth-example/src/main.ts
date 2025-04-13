import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import session from 'express-session';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { VersioningType } from '@nestjs/common';
import { RedisStore } from 'connect-redis';
import Redis from 'ioredis';
// import cookieParser from 'cookie-parser';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  const config = new DocumentBuilder()
    .setTitle('NestJS Auth Example')
    .setVersion('1.0')
    .addTag('examples')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  // app.use(cookieParser());
  // app.enableCors();
  const redis = new Redis({
    password: 'backend-examples',
  });
  const redisStore = new RedisStore({
    client: redis,
    prefix: 'nestjs-auth-example:',
  });
  app.use(
    session({
      store: redisStore,
      secret: 'nestjs-auth-example',
      resave: false,
      name: 'nestjs-auth-example',
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
