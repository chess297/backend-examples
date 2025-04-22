import * as path from 'path';
import { format, transports } from 'winston';
import * as winston from 'winston';
import { ConfigService } from '@nestjs/config';

export const createWinstonLogger = (configService: ConfigService) => {
  const logDir = path.join(process.cwd(), 'logs');
  const logLevel = configService.get<string>('log_level') || 'info';

  // 创建单行格式的控制台日志
  const singleLineFormat = format.printf(
    ({
      level,
      message,
      timestamp,
      context,
      ...meta
    }: winston.Logform.TransformableInfo) => {
      // 自定义颜色
      const colors = {
        error: '\x1b[31m', // 红色
        warn: '\x1b[33m', // 黄色
        info: '\x1b[32m', // 绿色
        debug: '\x1b[36m', // 青色
        verbose: '\x1b[35m', // 紫色
        reset: '\x1b[0m', // 重置颜色
      };

      // 日志级别颜色
      const colorLevel = `${colors[level] || ''}${level.toUpperCase()}${colors.reset}`;

      // 上下文信息
      const contextStr = context
        ? `[${colors.info}${String(context)}${colors.reset}]`
        : '';

      // 错误堆栈信息处理
      let errorStack = '';
      if (meta.trace || meta.stack) {
        errorStack = `\n${String(meta.trace || meta.stack)}`;
      }

      // 返回格式化的单行日志
      return `${timestamp} ${colorLevel} ${contextStr}: ${message}${errorStack}`;
    },
  );

  // 控制台日志格式
  const consoleFormat = format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.splat(),
    format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] }),
    singleLineFormat,
  );

  // 文件日志格式
  const fileFormat = format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.splat(),
    format.json(),
  );

  return {
    level: logLevel, // 默认日志级别
    transports: [
      // 控制台日志 - 单行显示
      new transports.Console({
        format: consoleFormat,
      }),
      // 错误日志文件
      new transports.File({
        filename: path.join(logDir, 'error.log'),
        level: 'error',
        format: fileFormat,
      }),
      // 合并日志文件
      new transports.File({
        filename: path.join(logDir, 'combined.log'),
        format: fileFormat,
      }),
    ],
    // 异常处理
    exceptionHandlers: [
      new transports.File({
        filename: path.join(logDir, 'exceptions.log'),
      }),
    ],
    rejectionHandlers: [
      new transports.File({
        filename: path.join(logDir, 'rejections.log'),
      }),
    ],
  } as winston.LoggerOptions;
};
