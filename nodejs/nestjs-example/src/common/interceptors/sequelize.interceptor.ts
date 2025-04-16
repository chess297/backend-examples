import { Request, Response } from 'express';
import { map, Observable } from 'rxjs';
import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class CommonResponse<T = any> {
  @ApiProperty({})
  data?: T;
  @ApiProperty()
  code: number = 0;
  @ApiProperty()
  message: string = 'success';
  @ApiProperty()
  timestamp: number = Date.now();
  constructor(data: T, code: number, message: string) {
    this.data = data;
    this.code = code;
    this.message = message;
  }
}

@Injectable()
export class SequelizeInterceptor<T> implements NestInterceptor<T, T> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<T> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    if (request.method === 'POST' && response.statusCode === 201) {
      response.status(HttpStatus.OK);
    }
    return next.handle().pipe(map((data: T) => data));
    // return next.handle().pipe(
    //   map((data: T) => {
    //     return new CommonResponse<T>(data, 0, 'success');
    //   }),
    // );
  }
}
