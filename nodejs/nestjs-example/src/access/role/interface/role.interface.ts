import { IPermission } from '@/access/permission/interface/permission.interface';

export interface IRole {
  id?: string;
  creator_id?: string;
  name: string;
  description: string;
  permissions?: IPermission[];
}
