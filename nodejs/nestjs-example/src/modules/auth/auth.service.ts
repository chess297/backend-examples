import { Injectable } from '@nestjs/common';
import { SigninRequest } from './dto/signin.dto';
import { SignupRequest } from './dto/signup.dto';

@Injectable()
export class AuthService {
  signin(dto: SigninRequest) {
    return dto;
  }

  signup(dto: SignupRequest) {
    return dto;
  }

  signout() {
    return 'sign out';
  }
}
