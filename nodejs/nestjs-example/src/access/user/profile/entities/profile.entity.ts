import { Profile } from '@prisma/clients/postgresql';
import { IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '@/common/entity/base.entity';

export class ProfileEntity extends BaseEntity implements Profile {
  @ApiProperty()
  @IsUUID()
  user_id: string;

  @ApiProperty()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsString()
  country_code: string;

  @ApiProperty()
  @IsString()
  address: string;
}
