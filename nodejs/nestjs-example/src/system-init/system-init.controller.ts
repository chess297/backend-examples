import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SystemAdmin } from '@/common/decorators/role.decorator';
import { APIOkResponse } from '@/common/decorators/swagger.decorator';
import { AuthGuard } from '@/common/guards/auth.guard';
import { AdminRegisterRequest } from './dto/admin-register.dto';
import { SystemCodeEntity } from './entities/system-code.entity';
import { SystemInitService } from './system-init.service';

@ApiTags('system-init')
@Controller('system-init')
export class SystemInitController {
  constructor(private readonly systemInitService: SystemInitService) {}

  @ApiOperation({
    summary: '检查系统是否已初始化',
    description: '检查系统是否已初始化，如果已初始化返回true，否则返回false',
    operationId: 'checkSystemInit',
  })
  @Get('check')
  async checkSystemInit(): Promise<{ initialized: boolean }> {
    const initialized = await this.systemInitService.isSystemInitialized();
    return { initialized };
  }

  @ApiOperation({
    summary: '生成系统初始化码',
    description:
      '生成系统初始化码，仅在系统未初始化时可用，用于后续注册管理员账号',
    operationId: 'generateSystemCode',
  })
  @Post('generate-code')
  @HttpCode(HttpStatus.OK)
  @APIOkResponse(SystemCodeEntity)
  async generateSystemCode(): Promise<{
    // code?: string;
    message: string;
    expires_at?: Date;
  }> {
    const isInitialized = await this.systemInitService.isSystemInitialized();
    if (isInitialized) {
      return {
        message: '系统已初始化，无法再生成系统码',
      };
    }

    const code = await this.systemInitService.generateSystemCode();
    // 设置过期时间为24小时后
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    return {
      //   code,
      expires_at: expiresAt,
      message: '系统码生成成功',
    };
  }

  @ApiOperation({
    summary: '使用系统码注册管理员账号',
    description: '使用系统码注册管理员账号，同时初始化系统',
    operationId: 'registerAdmin',
  })
  @Post('register-admin')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '管理员注册成功',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '系统码无效或已过期',
  })
  async registerAdmin(
    @Body() adminRegisterDto: AdminRegisterRequest,
  ): Promise<any> {
    // 检查系统是否已经初始化
    const isInitialized = await this.systemInitService.isSystemInitialized();
    if (isInitialized) {
      return {
        success: false,
        message: '系统已经初始化，无法再次注册管理员',
      };
    }

    return this.systemInitService.registerAdmin(adminRegisterDto);
  }
}
