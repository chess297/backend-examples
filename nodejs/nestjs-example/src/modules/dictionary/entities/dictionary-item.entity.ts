import { DictionaryItem } from '@prisma/client';
import {
  IsInt,
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '@/common/entity/base.entity';

export class DictionaryItemEntity extends BaseEntity implements DictionaryItem {
  @ApiProperty({ description: '字典ID' })
  @IsUUID()
  dictionary_id: string;

  @ApiProperty({ description: '字典项值' })
  @IsString()
  @IsNotEmpty()
  value: string;

  @ApiProperty({ description: '字典项标签' })
  @IsString()
  @IsNotEmpty()
  label: string;

  @ApiProperty({ description: '排序号', default: 0 })
  @IsInt()
  sort: number;

  @ApiProperty({ description: '额外数据', required: false })
  @IsJSON()
  @IsOptional()
  extra: any;
}
