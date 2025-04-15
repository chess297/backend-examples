import { SetMetadata } from '@nestjs/common';

export const SYSTEM_ADMIN_KEY = 'system-admin';
export const SystemAdmin = () => SetMetadata('role', SYSTEM_ADMIN_KEY);
