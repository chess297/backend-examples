import { ApiProperty } from '@nestjs/swagger';

// 成功的响应
export class SuccessResponse<T> {
  @ApiProperty({
    example: 0,
    title: '服务端处理结果状态码',
  })
  code: number = 0;

  @ApiProperty({
    example: 'success',
    title: '服务端处理结果状态信息',
  })
  message: string = 'success';

  @ApiProperty({
    title: '服务端处理结果数据',
  })
  data?: T;

  constructor(data: T) {
    this.data = data;
  }
}

// 异常的响应
export class BadResponse {
  @ApiProperty({
    example: 400,
    title: '服务端处理结果状态码',
  })
  code: number;

  @ApiProperty({
    example: 'error',
    title: '服务端处理结果状态信息',
  })
  message: string;
}

// 分页的数据体
export class PaginationData<T> {
  // @ApiProperty({
  //   example: 1,
  //   title: '当前页码',
  // })
  // current: number;
  @ApiProperty({
    example: 10,
    title: '每页显示条数',
  })
  total: number;
}

// 分页的响应
export class PaginationResponse<T> {
  @ApiProperty({
    example: 200,
    title: '服务端处理结果状态码',
  })
  code: number;

  @ApiProperty({
    example: 'success',
    title: '服务端处理结果状态信息',
  })
  message: string;

  @ApiProperty({
    title: '服务端处理结果数据',
  })
  data?: PaginationData<T>;

  constructor(data: PaginationData<T>) {
    // this.data = data;
    this.data = data;
  }
}
