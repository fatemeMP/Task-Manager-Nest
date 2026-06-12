import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto/create-task.dto';
import { GetTasksQueryDto } from './dto/get-tasks-query.dto/get-tasks-query.dto';

@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService:TasksService){}

    @Post()
    create(@Body() dto:CreateTaskDto){
        return this.tasksService.create(dto.title);
    }

     @Get()
     findAll(@Query() query:GetTasksQueryDto){
        return this.tasksService.findAll(query);
     }

     @Put(':id')
        update(@Param('id') id:string ,@Body() dto:CreateTaskDto){
            return this.tasksService.update(id,dto.title,dto.completed);
        }

        @Delete(':id')
        delete(@Param('id') id:string){
            return this.tasksService.delete(id);
        }

}
