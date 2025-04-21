import { IsArray, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMenuGroupRequest {
  @ApiProperty()
  @IsString()
  icon: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsArray({ each: true })
  @IsUUID()
  @IsOptional()
  menus: string[];

  @ApiProperty()
  @IsArray({ each: true })
  @IsUUID()
  @IsOptional()
  permissions: string[];
}
