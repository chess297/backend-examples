import { ApiProperty } from '@nestjs/swagger';

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

export class PaginationData<T> {
  @ApiProperty({
    example: 1,
    title: '当前页码',
  })
  current: number;
  @ApiProperty({
    example: 10,
    title: '每页显示条数',
  })
  total: number;

  @ApiProperty({
    title: '数据列表',
  })
  records: T[];
}

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
