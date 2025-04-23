import { Action, AppAbility, Subjects } from '../interfaces/ability.interface';
import { IPolicyHandler } from '../interfaces/policy-handler.interface';

// 创建具体资源的操作策略类
export class ReadPolicyHandler implements IPolicyHandler {
  constructor(private resource: Subjects) {}

  handle(ability: AppAbility): boolean {
    return ability.can(Action.Read, this.resource);
  }
}

export class CreatePolicyHandler implements IPolicyHandler {
  constructor(private resource: Subjects) {}

  handle(ability: AppAbility): boolean {
    return ability.can(Action.Create, this.resource);
  }
}

export class UpdatePolicyHandler implements IPolicyHandler {
  constructor(private resource: Subjects) {}

  handle(ability: AppAbility): boolean {
    return ability.can(Action.Update, this.resource);
  }
}

export class DeletePolicyHandler implements IPolicyHandler {
  constructor(private resource: Subjects) {}

  handle(ability: AppAbility): boolean {
    return ability.can(Action.Delete, this.resource);
  }
}

export class ManagePolicyHandler implements IPolicyHandler {
  constructor(private resource: Subjects) {}

  handle(ability: AppAbility): boolean {
    return ability.can(Action.Manage, this.resource);
  }
}

// 通用权限策略创建函数
export const CanRead = (resource: Subjects) => new ReadPolicyHandler(resource);
export const CanCreate = (resource: Subjects) =>
  new CreatePolicyHandler(resource);
export const CanUpdate = (resource: Subjects) =>
  new UpdatePolicyHandler(resource);
export const CanDelete = (resource: Subjects) =>
  new DeletePolicyHandler(resource);
export const CanManage = (resource: Subjects) =>
  new ManagePolicyHandler(resource);
