export class User {
  id: number;

  username: string;

  password: string;
}

export type RequestWithUser = Request & { user: Omit<User, 'id'> };
