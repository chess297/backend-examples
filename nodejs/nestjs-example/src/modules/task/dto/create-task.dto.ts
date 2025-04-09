import { Prisma } from 'generated/prisma';

export class CreateTaskDto implements Prisma.tasksCreateInput {
  task_id: string;
  create_at?: Date;
  update_at?: Date;
  title: string;
  description: string;
  completed?: boolean;
}
