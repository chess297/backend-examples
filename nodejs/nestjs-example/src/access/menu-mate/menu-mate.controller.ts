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
  APIOkResponse,
  APIPaginationResponse,
} from '@/common/decorators/swagger.decorator';
import { CreateMenuMateDto } from './dto/create-menu-mate.dto';
import { FindMenuMateQuery } from './dto/find-menu-mate.dto';
import { UpdateMenuMateDto } from './dto/update-menu-mate.dto';
import { MenuMateEntity } from './entities/menu-mate.entity';
import { MenuMateService } from './menu-mate.service';

@ApiTags('menu-mate')
@Controller('menu-mate')
export class MenuMateController {
  private readonly logger = new Logger(MenuMateController.name);

  constructor(private readonly menuMateService: MenuMateService) {}

  @ApiOperation({
    summary: '创建一个菜单项',
    operationId: 'createMenuMate',
  })
  @APIOkResponse(MenuMateEntity)
  @Post()
  create(@Body() createMenuMateDto: CreateMenuMateDto) {
    this.logger.debug(
      `Creating new menu mate: ${JSON.stringify(createMenuMateDto)}`,
    );
    return this.menuMateService.create(createMenuMateDto);
  }

  @ApiOperation({
    summary: '查询菜单元数据',
    operationId: 'queryMenuMate',
  })
  @APIPaginationResponse(MenuMateEntity)
  @Get()
  findAll(@Query() query: FindMenuMateQuery) {
    this.logger.debug(
      `Querying menu mates with filters: ${JSON.stringify(query)}`,
    );
    return this.menuMateService.findAll(query);
  }

  @ApiOperation({
    summary: '查询菜单元数据',
    operationId: 'getMenuMate',
  })
  @APIOkResponse(MenuMateEntity)
  @Get(':id')
  findOne(@Param('id') id: string) {
    this.logger.debug(`Finding menu mate by id: ${id}`);
    return this.menuMateService.findOne(id);
  }

  @ApiOperation({
    summary: '更新菜单元数据',
    operationId: 'updateMenuMate',
  })
  @APIOkResponse(MenuMateEntity)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMenuMateDto: UpdateMenuMateDto,
  ) {
    this.logger.debug(
      `Updating menu mate ${id}: ${JSON.stringify(updateMenuMateDto)}`,
    );
    return this.menuMateService.update(id, updateMenuMateDto);
  }

  @ApiOperation({
    summary: '删除菜单元数据',
    operationId: 'deleteMenuMate',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    this.logger.debug(`Removing menu mate: ${id}`);
    return this.menuMateService.remove(id);
  }
}
