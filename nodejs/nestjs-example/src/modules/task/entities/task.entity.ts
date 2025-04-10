import dayjs from 'dayjs';
import { Entity, Column } from 'typeorm';
@Entity({
  name: 'tasks',
})
export class Task {
  @Column({
    unique: true,
    name: 'task_id',
    primary: true,
  })
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({
    default: false,
  })
  completed: boolean;

  @Column({
    name: 'created_at',
    transformer: {
      to: (value: Date) => value,
      from: (value: string) => dayjs(value).format(),
    },
  })
  createAt: Date;
  @Column({
    name: 'updated_at',
    transformer: {
      to: (value: Date) => value,
      from: (value: string) => dayjs(value).format(),
    },
  })
  updateAt: Date;
}
