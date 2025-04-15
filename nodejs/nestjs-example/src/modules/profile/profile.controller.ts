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
import {
  ParserJwtAuthGuard,
  RequestWithUser,
} from '@/common/guards/auth.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  Read,
  Update,
  Permission,
} from '@/common/decorators/permission.decorator';
import { PermissionGuard } from '@/common/guards/permission.guard';

@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('user')
@UseGuards(ParserJwtAuthGuard, PermissionGuard)
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
  findOnnByUserId(@Req() req: RequestWithUser) {
    return this.profileService.findOneByUserId(req.user.id);
  }

  @ApiOperation({
    summary: '修改用户信息',
  })
  @Patch()
  update(
    @Req() req: RequestWithUser,
    @Body() updateProfileDto: UpdateProfileRequest,
  ) {
    return this.profileService.update(req.user.id, updateProfileDto);
  }
}
