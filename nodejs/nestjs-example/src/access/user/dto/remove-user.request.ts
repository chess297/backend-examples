import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RemoveUserRequest {
  @IsString()
  @ApiProperty({
    title: '需要删除的用户id',
  })
  @ValidateIf((o) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return !o.ids;
  })
  // ids 也不存在时出发id不为空的检测
  @IsOptional()
  id: string;

  @IsArray({ each: true })
  @IsNumber({}, { each: true })
  @ApiProperty({
    title: '批量删除的用户id列表',
  })
  @ArrayNotEmpty()
  @IsOptional()
  ids: string[];
}
