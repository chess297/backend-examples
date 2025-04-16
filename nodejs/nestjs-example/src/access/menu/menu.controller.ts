import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateMenuRequest } from './dto/create-menu.dto';
import { FindManyMenuResponse } from './dto/find-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { MenuService } from './menu.service';

@ApiTags('menu')
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @ApiOperation({ summary: '创建菜单', operationId: 'createMenu' })
  @Post()
  create(@Body() createMenuDto: CreateMenuRequest) {
    return this.menuService.create(createMenuDto);
  }

  @ApiOperation({ summary: '获取菜单列表', operationId: 'findManyMenu' })
  @Get()
  @ApiOkResponse({
    type: FindManyMenuResponse,
    description: '获取菜单列表成功',
  })
  findAll() {
    return this.menuService.findAll();
  }

  @ApiOperation({ summary: '获取菜单详情', operationId: 'findOneMenu' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.menuService.findOne(id);
  }

  @ApiOperation({ summary: '更新菜单', operationId: 'updateMenu' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto) {
    return this.menuService.update(id, updateMenuDto);
  }

  @ApiOperation({ summary: '删除菜单', operationId: 'removeMenu' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.menuService.remove(id);
  }
}
