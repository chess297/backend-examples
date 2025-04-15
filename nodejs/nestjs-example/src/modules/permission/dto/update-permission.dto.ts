import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreatePermissionDto } from './create-permission.dto';
import { IsArray, IsOptional } from 'class-validator';

export class UpdatePermissionDto extends PartialType(CreatePermissionDto) {
  @ApiProperty({
    description: '角色ID数组',
  })
  @IsArray()
  @IsOptional()
  roles?: string[];
}
