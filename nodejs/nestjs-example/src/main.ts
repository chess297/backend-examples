import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './modules/app/app.module';
import {
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { HttpExceptionsFilter } from './common/filters/http-exception.filter';
import { AllExceptionsFilter } from './common/filters/all-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ConfigService } from '@nestjs/config';
import dayjs from 'dayjs';
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
  app.useGlobalInterceptors(new TransformInterceptor());
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
}
function useSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('NestJS Example')
    .setDescription('The NestJS Example API description')
    .setVersion('1.0')
    .setBasePath('/api/v1')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, documentFactory, {
    jsonDocumentUrl: '/swagger-json',
  });
}
void bootstrap();
