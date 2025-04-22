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
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SystemAdmin } from '@/common/decorators/role.decorator';
import { APIOkResponse } from '@/common/decorators/swagger.decorator';
import { AuthGuard } from '@/common/guards/auth.guard';
import { DictionaryService } from './dictionary.service';
import { CreateDictionaryDto } from './dto/create-dictionary.dto';
import { DictionaryByCodeResponseDto } from './dto/dictionary-by-code.response.dto';
import { DictionaryListResponseDto } from './dto/dictionary-list.response.dto';
import { DictionaryResponseDto } from './dto/dictionary.response.dto';
import { FindDictionaryDto } from './dto/find-dictionary.dto';
import { UpdateDictionaryDto } from './dto/update-dictionary.dto';

@ApiTags('dictionary')
@Controller('dictionary')
export class DictionaryController {
  constructor(private readonly dictionaryService: DictionaryService) {}

  @Post()
  @ApiOperation({ summary: '创建字典' })
  @ApiBearerAuth()
  @SystemAdmin()
  @UseGuards(AuthGuard)
  @APIOkResponse(DictionaryResponseDto)
  create(@Body() createDictionaryDto: CreateDictionaryDto) {
    return this.dictionaryService.create(createDictionaryDto);
  }

  @Get()
  @ApiOperation({ summary: '查询字典列表' })
  @APIOkResponse(DictionaryListResponseDto)
  findAll(@Query() query: FindDictionaryDto) {
    return this.dictionaryService.findAll(query);
  }

  @Get('code/:code')
  @ApiOperation({ summary: '根据代码查询字典', operationId: 'findDistByCode' })
  @APIOkResponse(DictionaryByCodeResponseDto)
  findByCode(@Param('code') code: string) {
    return this.dictionaryService.findByCode(code);
  }

  @Get(':id')
  @ApiOperation({ summary: '查询字典详情' })
  @APIOkResponse(DictionaryResponseDto)
  findOne(@Param('id') id: string) {
    return this.dictionaryService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新字典' })
  @ApiBearerAuth()
  @SystemAdmin()
  @UseGuards(AuthGuard)
  @APIOkResponse(DictionaryResponseDto)
  update(
    @Param('id') id: string,
    @Body() updateDictionaryDto: UpdateDictionaryDto,
  ) {
    return this.dictionaryService.update(id, updateDictionaryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除字典' })
  @ApiBearerAuth()
  @SystemAdmin()
  @UseGuards(AuthGuard)
  @APIOkResponse(Boolean)
  remove(@Param('id') id: string) {
    return this.dictionaryService.remove(id);
  }
}
