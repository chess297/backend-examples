import { ApiProperty } from '@nestjs/swagger';
import { DictionaryItemEntity } from '../entities/dictionary-item.entity';
import { DictionaryEntity } from '../entities/dictionary.entity';

export class DictionaryResponseDto extends DictionaryEntity {
  @ApiProperty({
    description: '字典项列表',
    type: [DictionaryItemEntity],
    required: false,
  })
  declare items?: DictionaryItemEntity[];
}
