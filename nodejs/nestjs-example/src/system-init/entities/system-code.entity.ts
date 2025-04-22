import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '@/common/entity/base.entity';

export class SystemCodeEntity extends BaseEntity {
  //   @ApiProperty({
  //     description: '系统码',
  //     example: 'ABCD1234-5678-EFGH-9012-IJKLMNOPQRST',
  //   })
  //   @IsString()
  //   @IsNotEmpty()
  //   code: string;

  @ApiProperty({
    description: '是否已使用',
    example: false,
  })
  @IsBoolean()
  is_used: boolean;

  @ApiProperty({
    description: '过期时间',
    example: '2025-05-22T00:00:00.000Z',
  })
  expires_at: Date;
}
