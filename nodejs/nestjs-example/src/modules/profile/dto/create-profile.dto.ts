import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProfileRequest {
  id?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty()
  @IsString()
  @IsOptional({})
  phone?: string;

  @ApiProperty()
  @IsString()
  countryCode?: string;

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
  deleteAt: Date | null;
}
