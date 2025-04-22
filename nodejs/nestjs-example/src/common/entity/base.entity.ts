import { Exclude } from 'class-transformer';
import { IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BaseEntity {
  @ApiProperty()
  @IsUUID()
  @IsOptional()
  id: string;
  @ApiProperty()
  create_at: Date;
  @ApiProperty()
  update_at: Date;

  @Exclude()
  delete_at: Date | null;
}
