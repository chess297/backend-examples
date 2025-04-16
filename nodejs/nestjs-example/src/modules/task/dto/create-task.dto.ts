import { Prisma } from '@prisma/clients/postgresql';
import { Exclude } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskRequest {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  description: string;

  @IsBoolean()
  @IsOptional()
  completed?: boolean;

  @IsString()
  @IsNotEmpty()
  user_id: string;
}

// export class FindTaskResponse {
//   id: string;
//   title: string;
//   description: string;
// }

export class TaskModel implements Prisma.TaskMinAggregateOutputType {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsBoolean()
  completed: boolean;

  @Exclude()
  user_id: string | null;
  @ApiProperty()
  create_at: Date;
  @ApiProperty()
  update_at: Date;
  @Exclude()
  delete_at: Date | null;

  @ApiProperty()
  id: string;
}

export class FindTaskResponse {
  @ApiProperty({
    isArray: true,
    title: '任务列表',
    type: TaskModel,
  })
  records: TaskModel[];
  @ApiProperty()
  total: number;
  @ApiProperty()
  message?: string = 'success';

  constructor(partial: Partial<FindTaskResponse>) {
    Object.assign(this, partial);
  }
}
