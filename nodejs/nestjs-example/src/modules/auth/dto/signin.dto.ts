import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SigninRequest {
  // @ApiProperty()
  // @IsString()
  // @IsNotEmpty()
  // name: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class SigninResponse {
  @ApiProperty()
  access_token: string;
}
