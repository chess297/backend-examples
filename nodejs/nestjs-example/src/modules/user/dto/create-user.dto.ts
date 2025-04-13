import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { UserSchema } from '../entities/user.entity';

export class CreateUserRequest extends UserSchema {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  declare name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  declare email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  declare password: string;
}

export class GetUserResponse extends CreateUserRequest {
  constructor(partial: Partial<GetUserResponse>) {
    super();
    Object.assign(this, partial);
  }

  @Exclude()
  delete_at?: Date;

  @Exclude()
  declare password: string;
}
