import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { TaskStatus } from '../../common/enums/task-status.enum';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column({ default: false })
  completed!: boolean;

  @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.TODO })
  status!: TaskStatus;

  @ManyToOne(() => User, (user) => user.tasks, { onDelete: 'CASCADE' })
  user!: User;
}
