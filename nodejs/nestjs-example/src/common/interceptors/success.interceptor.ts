import { Request, Response } from 'express';
import { map, Observable } from 'rxjs';
import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { SuccessResponse } from '../dto/api.dto';

@Injectable()
export class SuccessResponseInterceptor<T>
  implements NestInterceptor<T, SuccessResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<SuccessResponse<T>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    if (request.method === 'POST' && response.statusCode === 201) {
      response.status(HttpStatus.OK);
    }
    return next.handle().pipe(
      map((data: T) => {
        return new SuccessResponse<T>(data);
      }),
    );
  }
}
