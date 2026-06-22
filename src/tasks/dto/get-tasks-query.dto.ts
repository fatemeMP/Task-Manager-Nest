import { IsEnum, IsNumberString, IsOptional } from "class-validator";
import { TaskStatus } from "../../common/enums/task-status.enum";

export class GetTasksQueryDto {
    @IsOptional()
    @IsEnum(TaskStatus)
    status?:TaskStatus;

    @IsOptional()
    @IsNumberString()
    page?:string;

    @IsOptional()
    @IsNumberString()
    limit?:string;
}
