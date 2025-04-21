import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Logger,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  Pagination,
  PaginationQuery,
} from '@/common/decorators/pagination.decorator';
import {
  APIOkResponse,
  APIPaginationResponse,
} from '@/common/decorators/swagger.decorator';
import { CreateMenuRequest } from './dto/create-menu.dto';
import { FindMenuQuery, MenuResponse } from './dto/find-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { MenuEntity } from './entities/menu.entity';
import { MenuService } from './menu.service';

@ApiTags('menu')
@Controller('menu')
export class MenuController {
  private readonly logger = new Logger(MenuController.name);

  constructor(private readonly menuService: MenuService) {}

  @ApiOperation({ summary: '创建菜单', operationId: 'createMenu' })
  @APIOkResponse(MenuResponse)
  @Post()
  create(@Body() createMenuDto: CreateMenuRequest) {
    this.logger.debug(`Creating menu: ${JSON.stringify(createMenuDto)}`);
    return this.menuService.create(createMenuDto);
  }

  @ApiOperation({ summary: '获取菜单列表', operationId: 'findManyMenu' })
  @Get()
  @APIPaginationResponse(MenuResponse)
  findAll(
    @Query() query: FindMenuQuery,
    @Pagination() pagination: PaginationQuery,
  ) {
    this.logger.debug(`Finding menus with query: ${JSON.stringify(query)}`);
    return this.menuService.findAll(query, pagination);
  }

  @ApiOperation({ summary: '获取菜单详情', operationId: 'findOneMenu' })
  @Get(':id')
  @APIOkResponse(MenuResponse)
  findOne(@Param('id') id: string) {
    this.logger.debug(`Finding menu by id: ${id}`);
    return this.menuService.findOne(id);
  }

  @ApiOperation({ summary: '更新菜单', operationId: 'updateMenu' })
  @Patch(':id')
  @APIOkResponse(MenuResponse)
  update(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto) {
    this.logger.debug(`Updating menu ${id}: ${JSON.stringify(updateMenuDto)}`);
    return this.menuService.update(id, updateMenuDto);
  }

  @ApiOperation({ summary: '删除菜单', operationId: 'removeMenu' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    this.logger.debug(`Removing menu: ${id}`);
    return this.menuService.remove(id);
  }
}
