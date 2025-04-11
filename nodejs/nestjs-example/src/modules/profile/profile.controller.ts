import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Logger,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileRequest } from './dto/create-profile.dto';
import { UpdateProfileRequest } from './dto/update-profile.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard, RequestWithUser } from '@/common/guards/auth.guard';

@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('user')
@UseGuards(AuthGuard)
@Controller('user/profile')
export class ProfileController {
  private readonly logger = new Logger(ProfileController.name);
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  create(@Body() createProfileDto: CreateProfileRequest) {
    return this.profileService.create(createProfileDto);
  }

  @Get()
  findOnnByUserId(@Req() req: RequestWithUser) {
    return this.profileService.findOneByUserId(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.profileService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateProfileRequest,
  ) {
    return this.profileService.update(id, updateProfileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.profileService.remove(+id);
  }
}
