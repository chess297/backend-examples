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
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CheckManage } from '@/common/decorators/check-policies.decorator';
import {
  Pagination,
  PaginationQuery,
} from '@/common/decorators/pagination.decorator';
import {
  APIOkResponse,
  APIPaginationResponse,
} from '@/common/decorators/swagger.decorator';
import { PoliciesGuard } from '@/common/guards/policies.guard';
import { CreateMenuGroupRequest } from './dto/create-menu-group.dto';
import { MenuGroupQuery } from './dto/find-menu-group.dto';
import { UpdateMenuGroupRequest } from './dto/update-menu-group.dto';
import { MenuGroupEntity } from './entities/menu-group.entity';
import { MenuGroupService } from './menu-group.service';

@ApiTags('menu-group')
@Controller('menu-group')
@UseGuards(PoliciesGuard)
export class MenuGroupController {
  constructor(private readonly menuGroupService: MenuGroupService) {}

  @ApiOperation({
    summary: '创建一个菜单分组',
    operationId: 'createMenuGroup',
  })
  @APIOkResponse(MenuGroupEntity)
  @Post()
  create(@Body() createMenuGroupDto: CreateMenuGroupRequest) {
    return this.menuGroupService.create(createMenuGroupDto);
  }

  @ApiOperation({
    summary: '查询菜单分组',
    operationId: 'queryMenuGroup',
  })
  @APIPaginationResponse(MenuGroupEntity)
  @Get()
  findAll(
    @Query() query: MenuGroupQuery,
    @Pagination() pagination: PaginationQuery,
  ) {
    return this.menuGroupService.findAll(query, pagination);
  }

  @ApiOperation({
    summary: '根据id查询菜单分组',
    operationId: 'findMenuGroupById',
  })
  @APIOkResponse(MenuGroupEntity)
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request) {
    return this.menuGroupService.findOne(id, req.session?.user?.is_admin);
  }

  @ApiOperation({
    summary: '更新菜单分组信息',
    operationId: 'updateMenuGroup',
  })
  @APIOkResponse(MenuGroupEntity)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMenuGroupDto: UpdateMenuGroupRequest,
  ) {
    return this.menuGroupService.update(id, updateMenuGroupDto);
  }

  @ApiOperation({
    summary: '删除菜单分组',
    operationId: 'deleteMenuGroup',
  })
  @Delete(':id')
  @CheckManage('MenuGroup')
  remove(@Param('id') id: string) {
    return this.menuGroupService.remove(id);
  }
}
