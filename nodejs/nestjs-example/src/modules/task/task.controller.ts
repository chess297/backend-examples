import { Request } from 'express';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ForbiddenException,
  Req,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CaslHelperService } from '@/common/casl/casl-helper.service';
import { Action } from '@/common/casl/interfaces/ability.interface';
import {
  CanCreate,
  CanRead,
  CanUpdate,
  CanDelete,
} from '@/common/casl/policies/ability.policies';
import { createPrismaSubject } from '@/common/casl/utils/prisma-subject.util';
import { CheckPolicies } from '@/common/decorators/check-policies.decorator';
import {
  APIOkResponse,
  APIPaginationResponse,
} from '@/common/decorators/swagger.decorator';
import { PoliciesGuard } from '@/common/guards/policies.guard';
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
@UseGuards(PoliciesGuard)
export class TaskController {
  constructor(
    private readonly taskService: TaskService,
    private readonly caslHelper: CaslHelperService,
  ) {}

  @ApiOperation({
    summary: '创建新的任务',
  })
  @APIOkResponse(TaskEntity)
  @Post()
  @CheckPolicies(CanCreate('Task'))
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
  @CheckPolicies(CanRead('Task'))
  async findAll(
    @Query() query: FindTaskQuery,
    @Req() req: Request,
  ): Promise<FindTaskResponse> {
    // 如果用户是管理员，就不需要权限过滤
    if (req.session?.user?.is_admin) {
      return this.taskService.findAll(query);
    }

    // 使用 CASL 生成权限过滤条件
    const accessibleWhereCondition = await this.caslHelper.getAccessibleWhere(
      Action.Read,
      'Task',
    );
    return this.taskService.findAll(query, accessibleWhereCondition);
  }

  @ApiOperation({
    summary: '查询单个任务',
  })
  @APIOkResponse(TaskEntity)
  @Get(':id')
  @CheckPolicies(CanRead('Task'))
  async findOne(@Param('id') id: string, @Req() req: Request) {
    const task = await this.taskService.findOne(id);
    if (!task) {
      throw new ForbiddenException('任务不存在');
    }

    // 管理员直接放行
    if (req.session?.user?.is_admin) {
      return task;
    }

    // 使用 createPrismaSubject 创建适合 CASL 的主体
    const ability = await this.caslHelper.getAbility();
    const taskSubject = createPrismaSubject('Task', task);

    // if (ability.cannot(Action.Read, taskSubject)) {
    //   throw new ForbiddenException('您没有权限查看此任务');
    // }

    return task;
  }

  @ApiOperation({
    summary: '修改任务',
  })
  @APIOkResponse(TaskEntity)
  @Patch(':id')
  @CheckPolicies(CanUpdate('Task'))
  async update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskRequest,
    @Req() req: Request,
  ) {
    const task = await this.taskService.findOne(id);
    if (!task) {
      throw new ForbiddenException('任务不存在');
    }

    // 管理员直接放行
    if (req.session?.user?.is_admin) {
      return this.taskService.update(id, updateTaskDto);
    }

    // 使用 createPrismaSubject 创建适合 CASL 的主体
    const ability = await this.caslHelper.getAbility();
    const taskSubject = createPrismaSubject('Task', task);

    // if (ability.cannot(Action.Update, taskSubject)) {
    //   throw new ForbiddenException('您没有权限修改此任务');
    // }

    return this.taskService.update(id, updateTaskDto);
  }

  @ApiOperation({
    summary: '删除任务',
  })
  @Delete(':id')
  @CheckPolicies(CanDelete('Task'))
  async remove(@Param('id') id: string, @Req() req: Request) {
    const task = await this.taskService.findOne(id);
    if (!task) {
      throw new ForbiddenException('任务不存在');
    }

    // 管理员直接放行
    if (req.session?.user?.is_admin) {
      return this.taskService.remove(id);
    }

    // 使用 createPrismaSubject 创建适合 CASL 的主体
    const ability = await this.caslHelper.getAbility();
    const taskSubject = createPrismaSubject('Task', task);

    // if (ability.cannot(Action.Delete, taskSubject)) {
    //   throw new ForbiddenException('您没有权限删除此任务');
    // }

    return this.taskService.remove(id);
  }
}
