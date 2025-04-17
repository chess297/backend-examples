import { User } from '@prisma/clients/postgresql';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { RoleEntity } from '@/access/role/entities/role.entity';

export class UserEntity implements User {
  @IsUUID()
  @IsOptional()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsArray()
  @IsOptional()
  roles?: RoleEntity[];

  create_at: Date;
  update_at: Date;
  delete_at: Date | null;
}
