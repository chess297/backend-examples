import dayjs from 'dayjs';
import { Entity, Column, DeleteDateColumn } from 'typeorm';
@Entity({
  name: 'tasks',
})
export class Task {
  @Column({
    unique: true,
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
    name: 'create_at',
    transformer: {
      to: (value: Date) => value,
      from: (value: string) => dayjs(value).format(),
    },
  })
  create_at: Date;
  @Column({
    name: 'update_at',
    transformer: {
      to: (value: Date) => value,
      from: (value: string) => dayjs(value).format(),
    },
  })
  update_at: Date;

  @DeleteDateColumn({
    name: 'delete_at',
    transformer: {
      to: (value: Date) => value,
      from: (value: string) => dayjs(value).format(),
    },
    nullable: true,
    default: null,
  })
  delete_at?: Date;
}
