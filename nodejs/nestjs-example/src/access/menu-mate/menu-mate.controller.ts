import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  APIOkResponse,
  APIPaginationResponse,
} from '@/common/decorators/swagger.decorator';
import { CreateMenuMateDto } from './dto/create-menu-mate.dto';
import { UpdateMenuMateDto } from './dto/update-menu-mate.dto';
import { MenuMateEntity } from './entities/menu-mate.entity';
import { MenuMateService } from './menu-mate.service';

@ApiTags('menu-mate')
@Controller('menu-mate')
export class MenuMateController {
  constructor(private readonly menuMateService: MenuMateService) {}

  @ApiOperation({
    summary: '创建一个菜单项',
    operationId: 'createMenuMate',
  })
  @APIOkResponse(MenuMateEntity)
  @Post()
  create(@Body() createMenuMateDto: CreateMenuMateDto) {
    return this.menuMateService.create(createMenuMateDto);
  }

  @ApiOperation({
    summary: '查询菜单元数据',
    operationId: 'queryMenuMate',
  })
  @APIPaginationResponse(MenuMateEntity)
  @Get()
  findAll() {
    return this.menuMateService.findAll();
  }

  @ApiOperation({
    summary: '查询菜单元数据',
    operationId: 'getMenuMate',
  })
  @APIOkResponse(MenuMateEntity)
  @Get(':id')
  findOne(@Param('id') id: string) {
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
    return this.menuMateService.update(id, updateMenuMateDto);
  }

  @ApiOperation({
    summary: '删除菜单元数据',
    operationId: 'deleteMenuMate',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.menuMateService.remove(id);
  }
}
