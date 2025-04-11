import { PartialType } from '@nestjs/swagger';
import { CreateProfileRequest } from './create-profile.dto';

export class UpdateProfileRequest extends PartialType(CreateProfileRequest) {}
