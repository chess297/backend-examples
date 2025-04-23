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
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CanCreate } from '@/common/casl/policies/ability.policies';
import {
  CheckCreate,
  CheckDelete,
  CheckPolicies,
} from '@/common/decorators/check-policies.decorator';
import {
  Pagination,
  PaginationQuery,
} from '@/common/decorators/pagination.decorator';
import {
  APIOkResponse,
  APIPaginationResponse,
} from '@/common/decorators/swagger.decorator';
import { AuthGuard } from '@/common/guards/auth.guard';
import { PoliciesGuard } from '@/common/guards/policies.guard';
import { AttachmentService } from '@/modules/attachment/attachment.service';
import { CreateUserRequest, UserResponse } from './dto/create-user.dto';
import { UserQuery } from './dto/query-user.dto';
import { RemoveUserRequest } from './dto/remove-user.request';
import {
  UpdateAvatarRequest,
  UpdateAvatarResponse,
} from './dto/update-avatar.dto';
import { UpdateUserRequest } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { UserService } from './user.service';

@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('user')
@Controller('user')
@UseGuards(PoliciesGuard)
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(
    private readonly userService: UserService,
    private readonly attachmentService: AttachmentService,
  ) {}

  @ApiOperation({
    summary: '创建新用户',
    operationId: 'createUser',
  })
  @APIOkResponse(UserEntity)
  @CheckCreate('User')
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
    return this.userService.findOne(req.session?.user?.id ?? '');
  }

  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: '获取用户信息',
    operationId: 'updateUserInfo',
  })
  @APIOkResponse(UserResponse)
  @Patch('info')
  updateUserInfo(
    @Req() req: Request,
    @Body() updateUserRequest: UpdateUserRequest,
  ) {
    return this.userService.update(
      req.session?.user?.id ?? '',
      updateUserRequest,
    );
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
    operationId: 'updateUserWithId',
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
  @ApiBody({ type: RemoveUserRequest, required: false })
  @CheckDelete('User')
  @Delete(':id')
  async remove(
    @Session() session: Request['session'],
    @Param('id') id: string,
    @Body() removeUserRequest?: RemoveUserRequest,
  ) {
    const _id = id || removeUserRequest?.id;
    if (_id) {
      if (session.user?.id === _id) {
        throw new BadRequestException('不能删除当前登录用户');
      }
      await this.userService.remove(_id);
    } else if (removeUserRequest?.ids) {
      await this.userService.removeMany(removeUserRequest?.ids);
    }
  }

  @Post('avatar')
  @ApiOperation({ summary: '上传用户头像', operationId: 'uploadAvatar' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @APIOkResponse(UpdateAvatarResponse)
  @ApiBody({ type: UpdateAvatarRequest })
  async uploadAvatar(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UpdateAvatarResponse> {
    // 获取当前登录用户ID
    const userId = req.session?.user?.id;
    if (!userId) {
      throw new BadRequestException('用户未登录');
    }

    // 上传文件到附件服务
    const attachment = await this.attachmentService.uploadFile(file);

    // 更新用户头像URL
    return this.userService.updateAvatar(userId, attachment.url);
  }
}
