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
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Permission } from '@/common/decorators/permission.decorator';
import {
  APIOkResponse,
  APIPaginationResponse,
} from '@/common/decorators/swagger.decorator';
import { PermissionGuard } from '@/common/guards/permission.guard';
import { CreateUserRequest } from './dto/create-user.dto';
import { RemoveUserRequest } from './dto/remove-user.request';
import { UserEntity } from './entities/user.entity';
import { UserService } from './user.service';

@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('user')
@Controller('user')
@Permission('user')
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
    summary: '获取用户信息',
    operationId: 'getUserInfo',
  })
  @APIOkResponse(UserEntity)
  @Get('info')
  getUserInfo(@Session() session: Request['session']) {
    console.log('🚀 ~ UserController ~ getUserInfo ~ session:', session);
    return this.userService.findOne(session.passport?.user.id ?? '');
  }

  @ApiOperation({
    summary: '查询多个用户',
    operationId: 'queryUsers',
  })
  @APIPaginationResponse(UserEntity)
  @Get()
  @ApiOkResponse({
    isArray: true,
    type: UserEntity,
  })
  findAll() {
    return this.userService.findAll();
  }

  @ApiOperation({
    summary: '查询单个用户',
    operationId: 'queryUser',
  })
  @APIOkResponse(UserEntity)
  @Get(':id')
  @APIOkResponse(UserEntity)
  findOn(@Param('id') id: string) {
    return this.userService.findOne(id);
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
