import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskRequest, FindTaskResponse } from './dto/create-task.dto';
import { UpdateTaskRequest } from './dto/update-task.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('task')
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskRequest) {
    return this.taskService.create(createTaskDto);
  }

  // @UseInterceptors(CacheInterceptor)
  @ApiOkResponse({
    type: FindTaskResponse,
  })
  @Get()
  findAll(): Promise<FindTaskResponse> {
    return this.taskService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskRequest) {
    return this.taskService.update(id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskService.remove(id);
  }
}
