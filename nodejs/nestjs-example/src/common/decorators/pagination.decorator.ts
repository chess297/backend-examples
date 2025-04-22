import { Request } from 'express';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export type PaginationQuery = {
  skip: number;
  take: number;
};

export const Pagination = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const { page, limit } = request.query;
    const pageNum = Number(page) || 1;
    const pageSizeNum = Number(limit) || 10;
    return {
      skip: (pageNum - 1) * pageSizeNum,
      take: pageSizeNum,
    };
  },
);
