import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { GetTasksQueryDto } from './dto/get-tasks-query.dto';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        private taskRepository: Repository<Task> 
    ){}

    async create(title: string, completed: boolean | undefined, userId: number) {
        const task = this.taskRepository.create({
            title,
            completed: completed ?? false,
            user: { id: userId },
        });
        return this.taskRepository.save(task);
    }

    async findAll(query: GetTasksQueryDto, userId: number) {
        const { status, page = '1', limit = '10' } = query;
        const pageNumber = parseInt(page, 10) || 1;
        const limitNumber = parseInt(limit, 10) || 10;

        const qb = this.taskRepository.createQueryBuilder('task');

        // SCOPE TO USER
        qb.where('task.userId = :userId', { userId });

        // FILTER BY STATUS
        if (status) {
            qb.andWhere('task.status = :status', { status });
        }

        // PAGINATION
        qb.skip((pageNumber - 1) * limitNumber);
        qb.take(limitNumber);

        const [data, total] = await qb.getManyAndCount();

        return {
            data,
            total,
            page: pageNumber,
            lastPage: Math.ceil(total / limitNumber),
        };
    }

    async findOne(id: string, userId: number) {
        const task = await this.taskRepository.findOneBy({
            id: +id,
            user: { id: userId },
        });
        if (!task) {
            throw new NotFoundException('Task not found');
        }
        return task;
    }

    async update(id: string, title: string, completed: boolean | undefined, userId: number) {
        const task = await this.taskRepository.findOneBy({
            id: +id,
            user: { id: userId },
        });
        if (!task) {
            throw new NotFoundException('Task not found');
        }
        task.title = title;
        if (completed !== undefined) {
            task.completed = completed;
        }
        return this.taskRepository.save(task);
    }

    async delete(id: string, userId: number) {
        const result = await this.taskRepository.delete({
            id: +id,
            user: { id: userId },
        });
        if (result.affected === 0) {
            throw new NotFoundException('Task not found');
        }
        return { message: 'Task deleted successfully.' };
    }

}
