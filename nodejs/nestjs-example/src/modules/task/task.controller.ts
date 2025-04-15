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
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('task')
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @ApiOperation({
    summary: '创建任务',
  })
  @Post()
  create(@Body() createTaskDto: CreateTaskRequest) {
    return this.taskService.create(createTaskDto);
  }

  @ApiOperation({
    summary: '查询所有任务',
  })
  // @UseInterceptors(CacheInterceptor)
  @ApiOkResponse({
    type: FindTaskResponse,
  })
  @Get()
  findAll(): Promise<FindTaskResponse> {
    return this.taskService.findAll();
  }

  @ApiOperation({
    summary: '根据id查询任务',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskService.findOne(id);
  }

  @ApiOperation({
    summary: '修改任务',
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskRequest) {
    return this.taskService.update(id, updateTaskDto);
  }

  @ApiOperation({
    summary: '删除任务',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskService.remove(id);
  }
}
