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
  Req,
  Logger,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Permission } from '@/common/decorators/permission.decorator';
import {
  APIOkResponse,
  APIPaginationResponse,
} from '@/common/decorators/swagger.decorator';
import { AuthGuard } from '@/common/guards/auth.guard';
import { PermissionGuard } from '@/common/guards/permission.guard';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { FindPermissionQuery } from './dto/find-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PermissionEntity } from './entities/permission.entity';
import { PermissionService } from './permission.service';

@ApiTags('permission')
@Controller('permission')
@UseGuards(AuthGuard, PermissionGuard)
export class PermissionController {
  private readonly logger = new Logger(PermissionController.name);

  constructor(private readonly permissionService: PermissionService) {}

  @ApiOperation({
    summary: '创建权限',
    description: '创建权限',
    operationId: 'createPermission',
  })
  @APIOkResponse(PermissionEntity)
  @Post()
  create(@Body() createPermissionDto: CreatePermissionDto) {
    this.logger.debug(
      `Creating permission: ${JSON.stringify(createPermissionDto)}`,
    );
    return this.permissionService.create(createPermissionDto);
  }

  @ApiOperation({
    summary: '查询所有权限',
    description: '查询所有权限，支持分页和筛选',
    operationId: 'findManyPermission',
  })
  @APIPaginationResponse(PermissionEntity)
  @Get()
  findAll(@Query() query: FindPermissionQuery) {
    this.logger.debug(
      `Finding all permissions with query: ${JSON.stringify(query)}`,
    );
    return this.permissionService.findAll(query);
  }

  @ApiOperation({
    summary: '根据id查询权限',
    operationId: 'findOnePermission',
    description: '根据id查询权限',
  })
  @APIOkResponse(PermissionEntity)
  @Get(':id')
  findOne(@Param('id') id: string) {
    this.logger.debug(`Finding permission by id: ${id}`);
    return this.permissionService.findOne(id);
  }

  @ApiOperation({
    summary: '获取当前登录用户的权限',
    description: '获取当前登录用户的权限',
    operationId: 'getUserPermission',
  })
  @APIOkResponse(PermissionEntity)
  @Get()
  getUserPermission(@Req() req: Request) {
    const userId = req.session.passport?.user.id ?? '';
    this.logger.debug(`Getting permissions for user: ${userId}`);
    return this.permissionService.findByUserId(userId);
  }

  @ApiOperation({
    summary: '修改权限',
    description: '修改权限',
    operationId: 'updatePermission',
  })
  @APIOkResponse(PermissionEntity)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    this.logger.debug(
      `Updating permission ${id}: ${JSON.stringify(updatePermissionDto)}`,
    );
    return this.permissionService.update(id, updatePermissionDto);
  }

  @ApiOperation({
    summary: '删除权限',
    description: '删除权限',
    operationId: 'removePermission',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    this.logger.debug(`Removing permission: ${id}`);
    return this.permissionService.remove(id);
  }
}
