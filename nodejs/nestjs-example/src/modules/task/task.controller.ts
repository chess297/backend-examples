import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CreateTaskRequest,
  FindTaskRequest,
  FindTaskResponse,
} from './dto/create-task.dto';
import { UpdateTaskRequest } from './dto/update-task.dto';
import { TaskService } from './task.service';

@ApiTags('task')
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @ApiOperation({
    summary: '创建新的任务',
  })
  @Post()
  create(@Body() createTaskDto: CreateTaskRequest) {
    return this.taskService.create(createTaskDto);
  }

  @ApiOperation({
    summary: '查询任务',
    description: '支持分页查询',
  })
  @ApiOkResponse({
    isArray: true,
    type: FindTaskResponse,
  })
  @Get()
  findAll(@Query() query: FindTaskRequest): Promise<FindTaskResponse> {
    console.log('🚀 ~ TaskController ~ findAll ~ query:', query);
    return this.taskService.findAll(query);
  }

  @ApiOperation({
    summary: '查询单个任务',
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

  // @ApiOperation({
  //   summary: '查询单个用户的任务',
  // })
  // @ApiOkResponse({
  //   isArray: true,
  //   type: FindTaskResponse,
  // })
  // @Get('/user/:id/task')
  // findUserTask(@Param('id') id: string) {
  //   return this.taskService.findUserTasks(id);
  // }
}
