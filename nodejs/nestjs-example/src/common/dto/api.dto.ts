import { ApiProperty } from '@nestjs/swagger';

export class CommonRequest {}
export class CommonResponse<T> {
  @ApiProperty()
  code: number;

  @ApiProperty()
  message: string;

  @ApiProperty()
  data: T;

  constructor(data: T) {
    this.data = data;
  }
}
