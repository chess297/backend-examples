import { ApiProperty } from '@nestjs/swagger';

export class BaseEntity {
  @ApiProperty()
  id: string;
  @ApiProperty()
  create_at: Date;
  @ApiProperty()
  update_at: Date;
  delete_at: Date | null;
}
