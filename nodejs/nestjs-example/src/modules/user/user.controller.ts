import {
  Controller,
  Get,
  Post,
  Body,
  Logger,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserRequest } from './dto/create-user.dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ParserJwtAuthGuard } from '@/common/guards/auth.guard';
import { RemoveUserRequest } from './dto/remove-user.request';
import { Prisma } from '@prisma/clients/postgresql';
import { TaskService } from '../task/task.service';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(ParserJwtAuthGuard)
@ApiTags('user')
@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(
    private readonly userService: UserService,
    private readonly taskService: TaskService,
  ) {}

  @ApiOperation({
    summary: '创建一个用户',
  })
  @Post()
  create(@Body() createUserDto: CreateUserRequest) {
    return this.userService.create(createUserDto);
  }

  @ApiOperation({
    summary: '查询用户',
  })
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @ApiOperation({
    summary: '删除用户',
  })
  @ApiBody({
    type: RemoveUserRequest,
  })
  @Delete()
  async remove(@Body() removeUserRequest: RemoveUserRequest) {
    try {
      if (removeUserRequest.id) {
        await this.userService.remove(removeUserRequest.id);
      } else {
        await this.userService.removeMany(removeUserRequest.ids);
      }
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new BadRequestException('删除用户失败：' + error.code);
      }
      throw new BadRequestException('删除用户失败');
    }
  }

  @Get('task')
  getUserTask() {}
}
