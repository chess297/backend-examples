import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  APIBadRequestResponse,
  APIOkResponse,
  APIPaginationResponse,
} from '@/common/decorators/swagger.decorator';
import { SystemRoleGuard } from '@/common/guards/role.guard';
import { CreateRoleRequest } from './dto/create-role.dto';
import { FindManyRoleQuery } from './dto/find.role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleEntity } from './entities/role.entity';
import { RoleService } from './role.service';

@UseGuards(SystemRoleGuard)
@ApiTags('role')
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @ApiOperation({
    summary: '创建角色',
  })
  @APIOkResponse(RoleEntity)
  @APIBadRequestResponse()
  @Post()
  create(@Body() createRoleDto: CreateRoleRequest) {
    return this.roleService.create(createRoleDto);
  }

  @ApiOperation({
    summary: '查询所有角色',
  })
  @APIPaginationResponse(RoleEntity)
  @APIBadRequestResponse()
  @Get()
  findAll(@Query() query: FindManyRoleQuery) {
    return this.roleService.findAll(query);
  }

  @ApiOperation({
    summary: '根据id查询角色',
  })
  @APIOkResponse(RoleEntity)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(id);
  }

  @ApiOperation({
    summary: '修改角色',
  })
  @APIOkResponse(RoleEntity)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(id, updateRoleDto);
  }

  @ApiOperation({
    summary: '删除角色',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roleService.remove(+id);
  }
}
