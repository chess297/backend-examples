import { PartialType } from '@nestjs/swagger';
import { CreateProfileRequest } from './create-profile.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateProfileRequest extends PartialType(CreateProfileRequest) {
  @IsOptional()
  user_id?: string;

  @IsString()
  name?: string;

  @IsString()
  email?: string;
}
