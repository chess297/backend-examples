import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { Public } from './common/decorators/public.decorator';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({
    summary: 'ping',
  })
  @Get('ping')
  @Public()
  ping(): string {
    // const expiryDate = new Date(Date.now() + 10000); // 设置过期时间为当前时间往后 10 秒
    // res.cookie('foo', 'bar', { expires: expiryDate });
    return this.appService.getPong();
  }
}
