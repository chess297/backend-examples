import { getRedisConnectionToken } from '@nestjs-modules/ioredis';
import { RedisStore } from 'connect-redis';
import cookieParser from 'cookie-parser';
import dayjs from 'dayjs';
import session from 'express-session';
import Redis from 'ioredis';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import passport from 'passport';
import {
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SuccessResponseInterceptor } from '@/common/interceptors/success.interceptor';
import { AllExceptionsFilter } from '@/filters/all-exception.filter';
import { HttpExceptionsFilter } from '@/filters/http-exception.filter';
import { AppModule } from './app.module';
import { APP_NAME } from './constants';

const PORT = process.env.PORT ?? 3000;
async function bootstrap() {
  dayjs.locale('zh-cn');
  const app = await NestFactory.create(AppModule);
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  const configService = app.get(ConfigService);
  resolveRoute(app, configService);
  useSwagger(app);
  usePipes(app);
  useFilters(app);
  useInterceptors(app);
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

function useInterceptors(app: INestApplication) {
  app.useGlobalInterceptors(new SuccessResponseInterceptor());
}

function usePipes(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
}

function useFilters(app: INestApplication) {
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalFilters(new HttpExceptionsFilter());
  app.use(cookieParser());
  const client: Redis = app.get(getRedisConnectionToken());
  const store = new RedisStore({
    client,
    prefix: `${APP_NAME}:`,
  });
  app.use(
    session({
      store,
      secret: 'backend-examples',
      name: APP_NAME,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
      },
    }),
  );
  app.use(passport.session());
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
