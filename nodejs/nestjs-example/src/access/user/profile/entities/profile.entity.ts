import { Profile, User } from '@prisma/clients/postgresql';
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

export class FullProfile
  extends BaseEntity
  implements Omit<Profile, 'user_id'>, User
{
  @ApiProperty()
  name: string;
  @ApiProperty()
  email: string;
  password: string;
  @ApiProperty()
  phone: string;
  @ApiProperty()
  country_code: string;
  @ApiProperty()
  address: string;
}
