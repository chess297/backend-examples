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
import { ProfileService } from './profile.service';
import { UpdateProfileRequest } from './dto/update-profile.dto';
import { AuthGuard, RequestWithUser } from '@/common/guards/auth.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('user')
@UseGuards(AuthGuard)
@Controller('user/profile')
export class ProfileController {
  private readonly logger = new Logger(ProfileController.name);
  constructor(private readonly profileService: ProfileService) {}

  @ApiOperation({
    summary: '查询用户信息',
  })
  @Get()
  findOnnByUserId(@Req() req: RequestWithUser) {
    return this.profileService.findOneByUserId(req.user.userId);
  }

  @ApiOperation({
    summary: '修改用户信息',
  })
  @Patch()
  update(
    @Req() req: RequestWithUser,
    @Body() updateProfileDto: UpdateProfileRequest,
  ) {
    return this.profileService.update(req.user.userId, updateProfileDto);
  }
}
