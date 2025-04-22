import { ApiProperty } from '@nestjs/swagger';
import { DictionaryEntity } from '../entities/dictionary.entity';

export class DictionaryListItemDto extends DictionaryEntity {
  @ApiProperty({ description: '字典项数量' })
  itemCount: number;
}

export class DictionaryListResponseDto {
  @ApiProperty({ description: '字典列表', type: [DictionaryListItemDto] })
  data: DictionaryListItemDto[];

  @ApiProperty({ description: '总数量' })
  total: number;

  @ApiProperty({ description: '当前页码' })
  page: number;

  @ApiProperty({ description: '每页数量' })
  pageSize: number;
}
