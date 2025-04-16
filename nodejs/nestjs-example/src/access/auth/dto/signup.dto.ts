import { ApiProperty } from '@nestjs/swagger';
import { CreateUserRequest } from '@/access/user/dto/create-user.dto';

export class SignupRequest extends CreateUserRequest {}

export class SignupResponse {
  @ApiProperty()
  id: string;
}
