import { IPermission } from '@/modules/permission/interface/permission.interface';

export interface IRole {
  id?: string;
  name: string;
  description: string;
  permissions?: IPermission[];
}
