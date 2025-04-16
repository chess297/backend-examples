import { Prisma } from '@prisma/clients/postgresql';
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
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserRequest } from './dto/create-user.dto';
import { RemoveUserRequest } from './dto/remove-user.request';
import { UserEntity } from './entities/user.entity';
import { UserService } from './user.service';

@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('user')
@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: '创建新用户',
  })
  @Post()
  create(@Body() createUserDto: CreateUserRequest) {
    return this.userService.create(createUserDto);
  }

  @ApiOperation({
    summary: '查询多个用户',
  })
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
  })
  @Get(':id')
  @ApiOkResponse({
    isArray: true,
    type: UserEntity,
  })
  findOn(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @ApiOperation({
    summary: '删除单个或多个用户',
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
