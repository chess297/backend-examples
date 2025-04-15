export interface IPermission {
  id?: string;
  name: string;
  description: string;
  actions?: string[];
  resources?: string[];
}
