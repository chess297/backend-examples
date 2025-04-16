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
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  Read,
  Update,
  Permission,
} from '@/common/decorators/permission.decorator';
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
    summary: '查询用户信息',
  })
  @Get()
  @Read()
  @Update()
  findOnnByUserId(@Req() req: Request) {
    return this.profileService.findOneByUserId(
      req.session.passport?.user.id ?? '',
    );
    // return this.profileService.findOneByUserId(req.user.id);
  }

  @ApiOperation({
    summary: '修改用户信息',
  })
  @Patch()
  update(@Req() req: Request, @Body() updateProfileDto: UpdateProfileRequest) {
    return this.profileService.update(req.user.id, updateProfileDto);
  }
}
