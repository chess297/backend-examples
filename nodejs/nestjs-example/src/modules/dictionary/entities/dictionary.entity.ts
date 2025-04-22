import { Dictionary } from '@prisma/client';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '@/common/entity/base.entity';
import { DictionaryItemEntity } from './dictionary-item.entity';

export class DictionaryEntity extends BaseEntity implements Dictionary {
  @ApiProperty({ description: '字典ID' })
  @IsUUID()
  id: string;

  @ApiProperty({ description: '字典代码' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ description: '字典名称' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: '字典描述', required: false })
  @IsString()
  @IsOptional()
  description: string | null;

  @ApiProperty({
    description: '字典项列表',
    type: [DictionaryItemEntity],
    required: false,
  })
  items?: DictionaryItemEntity[];
}
