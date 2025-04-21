export class Task {
  id: string;

  title: string;

  description: string;

  completed: boolean;

  create_at: Date;

  update_at: Date;

  delete_at?: Date;
}
