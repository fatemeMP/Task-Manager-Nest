import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [TasksController],
  providers: [TasksService],
  imports: [TypeOrmModule.forFeature([Task]), AuthModule],
})
export class TasksModule {}
