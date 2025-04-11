import { CreateUserRequest } from '@/modules/user/dto/create-user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class SignupRequest extends CreateUserRequest {}

export class SignupResponse {
  @ApiProperty()
  id: string;
}
