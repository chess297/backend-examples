import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDictionaryItemDto {
  @ApiProperty({ description: '字典项值' })
  @IsString()
  @IsNotEmpty()
  value: string;

  @ApiProperty({ description: '字典项标签' })
  @IsString()
  @IsNotEmpty()
  label: string;

  @ApiPropertyOptional({ description: '排序号', default: 0 })
  @IsInt()
  @IsOptional()
  sort?: number = 0;

  @ApiPropertyOptional({ description: '额外数据', type: Object })
  @IsOptional()
  extra?: Record<string, any>;
}
