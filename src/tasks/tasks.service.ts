import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository } from 'typeorm';
import { GetTasksQueryDto } from './dto/get-tasks-query.dto/get-tasks-query.dto';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        private taskRepository: Repository<Task> 
    ){}

    async create(title:string ){
        const task = this.taskRepository.create({title});
        return this.taskRepository.save(task);
    }

     async findAll(query:GetTasksQueryDto){
        const { status, page = '1', limit = '10' } = query;
        const pageNumber = parseInt(page ?? 1);
        const limitNumber = parseInt(limit ?? 10);
      
        const qb = this.taskRepository.createQueryBuilder('task');

        //  FILTER
        if (status) {
          qb.where('task.status = :status', { status });
        }

         //  PAGINATION
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

        async update(id:string ,title:string , completed?:boolean){
            const task = await this.taskRepository.findOneBy({id:+id});
            if(!task){
                throw new NotFoundException('Task not found');
            }
            task.title = title;
            if(completed !== undefined){
                task.completed = completed;
            }
            return this.taskRepository.save(task);
         }

        async delete(id:string){
            const task = await this.taskRepository.findOneBy({id:+id});
            if(!task){
                throw new NotFoundException('Task not found');
            }
            return { message:"delete was successfull.", status: 200 };
         }

}
