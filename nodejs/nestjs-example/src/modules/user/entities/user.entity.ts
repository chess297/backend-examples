import { ApiProperty } from '@nestjs/swagger';

export class UserSchema {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}
