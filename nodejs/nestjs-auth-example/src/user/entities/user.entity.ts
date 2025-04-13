export class User {
  id: number;

  username: string;
  email?: string;

  password: string;
}

export type RequestWithUser = Request & { user: Omit<User, 'id'> };
