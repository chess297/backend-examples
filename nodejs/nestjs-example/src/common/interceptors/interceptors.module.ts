import { Global, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { SessionTtlInterceptor } from './session-ttl.interceptor';
import { SuccessResponseInterceptor } from './success.interceptor';

@Global()
@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: SessionTtlInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: SuccessResponseInterceptor,
    },
  ],
})
export class InterceptorsModule {}
