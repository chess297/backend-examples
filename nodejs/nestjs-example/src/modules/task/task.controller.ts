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
  APIOkResponse,
  APIPaginationResponse,
} from '@/common/decorators/swagger.decorator';
import {
  CreateTaskRequest,
  FindTaskQuery,
  FindTaskResponse,
  TaskEntity,
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
  @APIOkResponse(TaskEntity)
  @Post()
  create(@Body() createTaskDto: CreateTaskRequest) {
    return this.taskService.create(createTaskDto);
  }

  @ApiOperation({
    summary: '查询任务',
    description: '支持分页查询',
  })
  @APIPaginationResponse(TaskEntity)
  @ApiOkResponse({
    isArray: true,
    type: FindTaskResponse,
  })
  @Get()
  findAll(@Query() query: FindTaskQuery): Promise<FindTaskResponse> {
    console.log('🚀 ~ TaskController ~ findAll ~ query:', query);
    return this.taskService.findAll(query);
  }

  @ApiOperation({
    summary: '查询单个任务',
  })
  @APIOkResponse(TaskEntity)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskService.findOne(id);
  }

  @ApiOperation({
    summary: '修改任务',
  })
  @APIOkResponse(TaskEntity)
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
