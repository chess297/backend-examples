import { getRedisConnectionToken } from '@nestjs-modules/ioredis';
import { RedisStore } from 'connect-redis';
import cookieParser from 'cookie-parser';
import * as dayjs from 'dayjs';
import express from 'express';
import session from 'express-session';
import Redis from 'ioredis';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import passport from 'passport';
import path from 'path';
import {
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from '@/filters/all-exception.filter';
import { HttpExceptionsFilter } from '@/filters/http-exception.filter';
import { AppModule } from './app.module';
import { APP_NAME } from './constants';

const PORT = process.env.PORT ?? 3000;
async function bootstrap() {
  dayjs.locale('zh-cn');
  const app = await NestFactory.create(AppModule, {
    // logger: false,
  });
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  const configService = app.get(ConfigService);
  resolveRoute(app, configService);
  useSwagger(app);
  usePipes(app);
  useFilters(app, configService);
  useStatic(app, configService);
  await app.listen(configService.get('port') ?? PORT);
}

function resolveRoute(app: INestApplication, configService: ConfigService) {
  app.setGlobalPrefix(configService.get<string>('prefix', 'api'));
  const defaultVersion = configService.get<string[]>('version', ['1']);
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion,
  });
}

function usePipes(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
}

function useFilters(app: INestApplication, configService: ConfigService) {
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalFilters(new HttpExceptionsFilter());
  app.use(cookieParser());
  const client: Redis = app.get(getRedisConnectionToken());
  const store = new RedisStore({
    client,
    prefix: `${APP_NAME}:`,
  });

  // 从配置中获取session的maxAge设置 (单位：秒)
  const sessionMaxAge = configService.get<number>(
    'session.maxAge',
    7 * 24 * 60 * 60,
  );

  app.use(
    session({
      store,
      secret: 'backend-examples',
      name: APP_NAME,
      resave: false,
      saveUninitialized: false,
      rolling: true, // 每次请求都更新session的过期时间
      cookie: {
        httpOnly: true,
        maxAge: sessionMaxAge * 1000, // 转换为毫秒
      },
    }),
  );
  // app.use(passport.session());
}

// 添加静态文件服务
function useStatic(app: INestApplication, configService: ConfigService) {
  const uploadDir = configService.get<string>('upload_dir', 'uploads');
  const uploadPath = path.join(process.cwd(), uploadDir);
  app.use('/uploads', express.static(uploadPath, {}));
}

function useSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('NestJS Example')
    .setDescription('The NestJS Example API description')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, documentFactory, {
    jsonDocumentUrl: '/swagger-json',
  });
}
void bootstrap();
