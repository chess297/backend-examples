import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// 一个示例的守卫，它使用名为 'local' 的策略进行身份验证。
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
