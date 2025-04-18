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
import { APIOkResponse } from '@/common/decorators/swagger.decorator';
import { AuthGuard } from '@/common/guards/auth.guard';
// import { PermissionGuard } from '@/common/guards/permission.guard';
import { UpdateProfileRequest } from './dto/update-profile.dto';
import { FullProfile } from './entities/profile.entity';
import { ProfileService } from './profile.service';

@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('user')
@UseGuards(AuthGuard)
@Controller('user/profile')
@Permission('profile')
export class ProfileController {
  private readonly logger = new Logger(ProfileController.name);
  constructor(private readonly profileService: ProfileService) {}

  @ApiOperation({
    summary: '获取当前用户的信息',
    operationId: 'getUserProfile',
  })
  @APIOkResponse(FullProfile)
  @Get()
  findOnnByUserId(@Req() req: Request) {
    return this.profileService.findOneByUserId(
      req.session.passport?.user.id ?? '',
    );
  }

  @ApiOperation({
    summary: '修改当前用户信息',
    operationId: 'updateUserProfile',
  })
  @APIOkResponse(FullProfile)
  @Patch()
  update(@Req() req: Request, @Body() updateProfileDto: UpdateProfileRequest) {
    return this.profileService.update(
      req.session.passport?.user.id ?? '',
      updateProfileDto,
    );
  }

  @ApiOperation({
    summary: '获取路径id用户信息',
  })
  @APIOkResponse(FullProfile)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.profileService.findOne(id);
  }

  @ApiOperation({
    summary: '修改路径id用户信息',
  })
  @APIOkResponse(FullProfile)
  @Patch(':id')
  updateOne(
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateProfileRequest,
  ) {
    return this.profileService.update(id, updateProfileDto);
  }
}
