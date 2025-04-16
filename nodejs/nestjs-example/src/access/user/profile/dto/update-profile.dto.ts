import { IsOptional, IsString } from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { CreateProfileRequest } from './create-profile.dto';

export class UpdateProfileRequest extends PartialType(CreateProfileRequest) {
  @IsOptional()
  user_id?: string;

  @IsString()
  name?: string;

  @IsString()
  email?: string;
}
