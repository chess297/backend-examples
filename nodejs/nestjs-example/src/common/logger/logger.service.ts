import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import {
  Inject,
  Injectable,
  LoggerService as NestLoggerService,
} from '@nestjs/common';

@Injectable()
export class LoggerService implements NestLoggerService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  log(message: any, context?: string): void {
    this.logger.info(message, { context });
  }

  error(message: any, trace?: string, context?: string): void {
    this.logger.error(message, { trace, context });
  }

  warn(message: any, context?: string): void {
    this.logger.warn(message, { context });
  }

  debug(message: any, context?: string): void {
    this.logger.debug(message, { context });
  }

  verbose(message: any, context?: string): void {
    this.logger.verbose(message, { context });
  }
}
