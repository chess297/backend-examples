import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProfileRequest {
  id?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @ApiProperty()
  @IsString()
  @IsOptional({})
  phone?: string;

  @ApiProperty()
  @IsString()
  country_code?: string;

  @ApiProperty()
  @IsString()
  address?: string;
}

export class GetProfileResponse extends CreateProfileRequest {
  constructor(partial: Partial<GetProfileResponse>) {
    super();
    Object.assign(this, partial);
  }
  @Exclude()
  user?: any;

  @ApiProperty()
  @IsString()
  email: string;

  @Exclude()
  delete_at: Date | null;
}
