import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
// import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
// export type User = {
//   username: string;
//   password: string;
// };
const users: User[] = [
  {
    id: 1,
    username: 'john',
    password: 'changeme',
  },
  {
    id: 2,
    username: 'maria',
    password: 'guess',
  },
  {
    id: 3,
    username: 'example',
    password: 'example',
  },
];

@Injectable()
export class UserService {
  findOne(username: string): User | undefined {
    return users.find((user) => user.username === username);
  }
}
