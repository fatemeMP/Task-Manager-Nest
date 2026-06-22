import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Task } from '../../tasks/entities/task.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany(() => Task, (task) => task.user)
  tasks!: Task[];
}
