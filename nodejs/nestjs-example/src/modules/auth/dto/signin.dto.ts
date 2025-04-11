import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SigninRequest {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  // @ApiProperty()
  // email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}
