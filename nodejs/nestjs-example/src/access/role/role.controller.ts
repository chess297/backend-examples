import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleRequest } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SystemRoleGuard } from '@/common/guards/role.guard';

@UseGuards(SystemRoleGuard)
@ApiTags('role')
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @ApiOperation({
    summary: '创建角色',
  })
  @Post()
  @ApiOkResponse()
  create(@Body() createRoleDto: CreateRoleRequest) {
    return this.roleService.create(createRoleDto);
  }

  @ApiOperation({
    summary: '查询所有角色',
  })
  @Get()
  findAll() {
    return this.roleService.findAll();
  }

  @ApiOperation({
    summary: '根据id查询角色',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(id);
  }

  @ApiOperation({
    summary: '修改角色',
  })
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
