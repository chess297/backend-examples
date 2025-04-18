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
  constructor(private readonly permissionService: PermissionService) {}

  @ApiOperation({
    summary: '创建权限',
    description: '创建权限',
    operationId: 'createPermission',
  })
  @APIOkResponse(PermissionEntity)
  @Post()
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionService.create(createPermissionDto);
  }

  @ApiOperation({
    summary: '获取当前登录用户的权限',
    description: '获取当前登录用户的权限',
    operationId: 'getUserPermission',
  })
  @APIOkResponse(PermissionEntity)
  @Get('/user/permission')
  getUserPermission(@Req() req: Request) {
    return this.permissionService.findByUserId(
      req.session.passport?.user.id ?? '',
    );
  }

  @ApiOperation({
    summary: '查询所有权限',
    description: '查询所有权限',
    operationId: 'findManyPermission',
  })
  @APIPaginationResponse(PermissionEntity)
  @Get()
  findAll(@Query() query: FindPermissionQuery) {
    console.log('🚀 ~ PermissionController ~ findAll ~ query:', query);
    return this.permissionService.findAll();
  }

  @ApiOperation({
    summary: '根据id查询权限',
    operationId: 'findOnePermission',
    description: '根据id查询权限',
  })
  @APIOkResponse(PermissionEntity)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.permissionService.findOne(id);
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
    return this.permissionService.update(id, updatePermissionDto);
  }

  @ApiOperation({
    summary: '删除权限',
    description: '删除权限',
    operationId: 'removePermission',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.permissionService.remove(id);
  }
}
