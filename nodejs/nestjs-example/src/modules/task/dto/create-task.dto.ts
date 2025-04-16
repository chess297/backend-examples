import { Prisma } from '@prisma/clients/postgresql';
import { Exclude } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationInterface } from '@/common/interface/pagination.interface';

export class CreateTaskRequest {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  completed?: boolean;

  @ApiProperty({
    title: '创建者',
  })
  @IsString()
  @IsOptional()
  creator?: string;
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
  creator_id: string | null;

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

export class FindTaskRequest implements PaginationInterface {
  @ApiProperty({
    title: '页码',
    required: false,
    default: 0,
  })
  @IsOptional()
  page?: number = 0;

  @ApiProperty({
    title: '每页数量',
    required: false,
    default: 10,
  })
  @IsOptional()
  limit?: number = 10;

  @ApiProperty({
    title: '任务id',
    required: false,
  })
  @IsOptional()
  id?: string;

  @ApiProperty({
    title: '创建者id',
    required: false,
  })
  @IsOptional()
  creator?: string;
}
