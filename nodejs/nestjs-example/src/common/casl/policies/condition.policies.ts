import { Action, AppAbility, Subjects } from '../interfaces/ability.interface';
import { IPolicyHandler } from '../interfaces/policy-handler.interface';

/**
 * 用于创建条件性权限策略的工厂函数
 * 可以基于对象属性进行细粒度的权限控制
 */
export class ConditionPolicyHandler<T = any> implements IPolicyHandler {
  constructor(
    private readonly action: Action,
    private readonly subject: Subjects,
    private readonly conditionFn: (resource: T) => boolean,
    private readonly resource: T,
  ) {}

  handle(ability: AppAbility): boolean {
    // 首先检查用户是否有基本权限
    if (ability.cannot(this.action, this.subject)) {
      return false;
    }

    // 然后检查条件函数
    return this.conditionFn(this.resource);
  }
}

/**
 * 创建一个检查用户是否只能操作自己资源的策略
 * 例如：用户只能修改自己创建的任务
 */
export const OnlyOwnerPolicy = (
  action: Action,
  subject: Subjects,
  resource: any,
  userId: string,
) => {
  return new ConditionPolicyHandler(
    action,
    subject,
    (item) => item.creator_id === userId,
    resource,
  );
};

/**
 * 创建一个检查特定条件的策略
 */
export const CustomConditionPolicy = <T>(
  action: Action,
  subject: Subjects,
  resource: T,
  conditionFn: (resource: T) => boolean,
) => {
  return new ConditionPolicyHandler(action, subject, conditionFn, resource);
};
