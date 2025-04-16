import { utilities, WinstonModule } from 'nest-winston';
import { join } from 'path';
import { format } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { Console } from 'winston/lib/winston/transports';
import { Global, Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// import { LoggerModule } from 'nestjs-pino';
// import { __IS_DEV__ } from '@/constants';

const transports = new Console({
  level: 'info',
  format: format.combine(format.timestamp(), utilities.format.nestLike()),
});

function createDailyRotateTransport(level: string, filename: string) {
  return new DailyRotateFile({
    level,
    dirname: join(process.cwd(), 'logs'),
    filename: `${filename}-%DATE%.log`,
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    format: format.combine(format.timestamp(), format.simple()),
  });
}
@Global()
@Module({
  imports: [
    // winston日志
    WinstonModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transports: [
          transports,
          ...(configService.get('log_on')
            ? [
                createDailyRotateTransport('info', 'application'),
                createDailyRotateTransport('warn', 'error'),
              ]
            : []),
        ],
      }),
    }),
    // pino日志
    // LoggerModule.forRoot({
    //   pinoHttp: {
    //     transport: {
    //       targets: [
    //         __IS_DEV__
    //           ? {
    //               target: 'pino-pretty',
    //               options: {
    //                 singleLine: true,
    //                 colorize: true,
    //               },
    //             }
    //           : {
    //               target: 'pino-roll',
    //               options: {
    //                 file: join(process.cwd(), 'logs', 'app.log'),
    //                 frequency: 'daily',
    //                 size: '5m',
    //                 count: 30,
    //                 mkdir: true,
    //               },
    //             },
    //       ],
    //     },
    //   },
    // }),
  ],
  providers: [Logger],
  exports: [Logger],
})
export class LoggerModule {}
