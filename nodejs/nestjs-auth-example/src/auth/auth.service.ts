import { Injectable } from '@nestjs/common';
import { UserService } from '@/user/user.service';
import { User } from '@/user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(private usersService: UserService) {}

  validateUser(username: string, pass: string): Omit<User, 'password'> | null {
    const user = this.usersService.findOne(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      console.log('🚀 ~ AuthService ~ validateUser ~ password:', password);
      return result;
    }
    return null;
  }
}
