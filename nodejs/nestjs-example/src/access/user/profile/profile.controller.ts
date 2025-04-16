import { Request } from 'express';
import {
  Controller,
  Get,
  Body,
  UseGuards,
  Req,
  Logger,
  UseInterceptors,
  ClassSerializerInterceptor,
  Patch,
  Param,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Permission } from '@/common/decorators/permission.decorator';
import { PermissionGuard } from '@/common/guards/permission.guard';
import { UpdateProfileRequest } from './dto/update-profile.dto';
import { ProfileService } from './profile.service';

@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('user')
@UseGuards(PermissionGuard)
@Controller('user/profile')
@Permission('profile')
export class ProfileController {
  private readonly logger = new Logger(ProfileController.name);
  constructor(private readonly profileService: ProfileService) {}

  @ApiOperation({
    summary: '获取当前用户的信息',
  })
  @Get()
  findOnnByUserId(@Req() req: Request) {
    return this.profileService.findOneByUserId(
      req.session.passport?.user.id ?? '',
    );
  }

  @ApiOperation({
    summary: '修改当前用户信息',
  })
  @Patch()
  update(@Req() req: Request, @Body() updateProfileDto: UpdateProfileRequest) {
    return this.profileService.update(req.user.id, updateProfileDto);
  }

  // TODO 修改/获取其他用户的信息应该需要权限
  @ApiOperation({
    summary: '获取路径id用户信息',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.profileService.findOne(id);
  }

  @ApiOperation({
    summary: '修改路径id用户信息',
  })
  @Patch(':id')
  updateOne(
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateProfileRequest,
  ) {
    return this.profileService.update(id, updateProfileDto);
  }
}
