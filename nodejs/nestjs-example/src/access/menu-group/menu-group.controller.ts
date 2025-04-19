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
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  APIOkResponse,
  APIPaginationResponse,
} from '@/common/decorators/swagger.decorator';
import { CreateMenuGroupDto } from './dto/create-menu-group.dto';
import { FindMenuGroupQuery } from './dto/find-menu-group.dto';
import { UpdateMenuGroupDto } from './dto/update-menu-group.dto';
import { MenuGroupEntity } from './entities/menu-group.entity';
import { MenuGroupService } from './menu-group.service';

@ApiTags('menu-group')
@Controller('menu-group')
export class MenuGroupController {
  constructor(private readonly menuGroupService: MenuGroupService) {}

  @ApiOperation({
    summary: '创建一个菜单分组',
    operationId: 'createMenuGroup',
  })
  @APIOkResponse(MenuGroupEntity)
  @Post()
  create(@Body() createMenuGroupDto: CreateMenuGroupDto) {
    return this.menuGroupService.create(createMenuGroupDto);
  }

  @ApiOperation({
    summary: '查询菜单分组',
    operationId: 'queryMenuGroup',
  })
  @APIPaginationResponse(MenuGroupEntity)
  @Get()
  findAll(@Query() query: FindMenuGroupQuery) {
    return this.menuGroupService.findAll(query);
  }

  @ApiOperation({
    summary: '根据id查询菜单分组',
    operationId: 'findMenuGroupById',
  })
  @APIOkResponse(MenuGroupEntity)
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request) {
    return this.menuGroupService.findOne(
      id,
      req.session.passport?.is_admin,
      req.session.passport?.permissions,
    );
  }

  @ApiOperation({
    summary: '更新菜单分组信息',
    operationId: 'updateMenuGroup',
  })
  @APIOkResponse(MenuGroupEntity)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMenuGroupDto: UpdateMenuGroupDto,
  ) {
    return this.menuGroupService.update(id, updateMenuGroupDto);
  }

  @ApiOperation({
    summary: '删除菜单分组',
    operationId: 'deleteMenuGroup',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.menuGroupService.remove(id);
  }
}
