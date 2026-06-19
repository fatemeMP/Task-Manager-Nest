import { Body, Controller, Delete, Get, Logger, Param, Post, Put, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto/create-task.dto';
import { GetTasksQueryDto } from './dto/get-tasks-query.dto/get-tasks-query.dto';

@Controller('tasks')
export class TasksController {
    private readonly logger = new Logger(TasksController.name);

    constructor(private readonly tasksService: TasksService) {}

    @Post()
    create(@Body() dto: CreateTaskDto) {
        this.logger.log(`درخواست ایجاد تسک جدید: ${dto.title}`);
        return this.tasksService.create(dto.title);
    }

    @Get()
    findAll(@Query() query: GetTasksQueryDto) {
        this.logger.log('درخواست دریافت لیست تسک‌ها');
        return this.tasksService.findAll(query);
     }

    @Put(':id')
    update(
        @Param('id') id: string,
        @Body() dto: CreateTaskDto,
    ) {
        this.logger.log(`درخواست ویرایش تسک با شناسه ${id}`);
        return this.tasksService.update(id, dto.title, dto.completed);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        this.logger.log(`درخواست حذف تسک با شناسه ${id}`);
        return this.tasksService.delete(id);
    }
}
