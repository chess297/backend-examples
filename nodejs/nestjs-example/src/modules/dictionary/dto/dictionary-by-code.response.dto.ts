import { ApiProperty } from '@nestjs/swagger';
import { DictionaryItemEntity } from '../entities/dictionary-item.entity';
import { DictionaryEntity } from '../entities/dictionary.entity';

export class DictionaryByCodeResponseDto extends DictionaryEntity {
  @ApiProperty({
    description: '字典项列表',
    type: [DictionaryItemEntity],
  })
  declare items: DictionaryItemEntity[];
}
