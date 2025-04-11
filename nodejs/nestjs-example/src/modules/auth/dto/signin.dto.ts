import { ApiProperty } from '@nestjs/swagger';

export class SigninRequest {
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;
}
