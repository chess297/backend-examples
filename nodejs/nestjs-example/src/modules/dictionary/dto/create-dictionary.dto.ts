import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateDictionaryItemDto } from './create-dictionary-item.dto';

export class CreateDictionaryDto {
  @ApiProperty({ description: '字典代码' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ description: '字典名称' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: '字典描述' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: '字典项列表',
    type: [CreateDictionaryItemDto],
    isArray: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDictionaryItemDto)
  @IsOptional()
  items?: CreateDictionaryItemDto[];
}
