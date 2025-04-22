import { Prisma } from '@prisma/client';
import { Request } from 'express';
import {
  Controller,
  Get,
  Post,
  Body,
  Logger,
  UseInterceptors,
  ClassSerializerInterceptor,
  Delete,
  BadRequestException,
  Param,
  UseGuards,
  Session,
  Req,
  Query,
  Patch,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  Pagination,
  PaginationQuery,
} from '@/common/decorators/pagination.decorator';
import {
  APIOkResponse,
  APIPaginationResponse,
} from '@/common/decorators/swagger.decorator';
import { AuthGuard, SessionGuard } from '@/common/guards/auth.guard';
import { PermissionGuard } from '@/common/guards/permission.guard';
import { CreateUserRequest, UserResponse } from './dto/create-user.dto';
import { UserQuery } from './dto/query-user.dto';
import { RemoveUserRequest } from './dto/remove-user.request';
import { UpdateUserRequest } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { UserService } from './user.service';

@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('user')
@Controller('user')
@UseGuards(PermissionGuard)
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: '创建新用户',
    operationId: 'createUser',
  })
  @APIOkResponse(UserEntity)
  @Post()
  create(@Body() createUserDto: CreateUserRequest) {
    return this.userService.create(createUserDto);
  }

  @ApiOperation({
    summary: '查询多个用户',
    operationId: 'queryUsers',
  })
  @APIPaginationResponse(UserResponse)
  @Get()
  @APIPaginationResponse(UserResponse)
  findAll(
    @Query() query: UserQuery,
    @Pagination() pagination: PaginationQuery,
  ) {
    return this.userService.findAll(query, pagination);
  }

  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: '获取用户信息',
    operationId: 'getUserInfo',
  })
  @APIOkResponse(UserResponse)
  @Get('info')
  getUserInfo(@Req() req: Request) {
    return this.userService.findOne(req.session.passport?.user.id ?? '');
  }

  @ApiOperation({
    summary: '查询单个用户',
    operationId: 'getUser',
  })
  @APIOkResponse(UserResponse)
  @Get(':id')
  findOn(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @ApiOperation({
    summary: '查询单个用户',
    operationId: 'getUser',
  })
  @APIOkResponse(UserResponse)
  @Patch(':id')
  updateUser(
    @Param('id') id: string,
    @Body() updateUserRequest: UpdateUserRequest,
  ) {
    return this.userService.update(id, updateUserRequest);
  }

  @ApiOperation({
    summary: '删除单个或多个用户',
    operationId: 'removeUser',
  })
  @ApiBody({
    type: RemoveUserRequest,
  })
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Body() removeUserRequest: RemoveUserRequest,
  ) {
    try {
      if (id || removeUserRequest.id) {
        await this.userService.remove(id || removeUserRequest.id);
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
}
