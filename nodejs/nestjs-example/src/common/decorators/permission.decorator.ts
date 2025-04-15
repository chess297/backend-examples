/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Action } from '@/constants/enums/action.enum';
import { SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const PERMISSION_KEY = 'permission';

function merge(key: string, value: string) {
  return (
    // ?? target 为什么只能给any？
    target: any,
    propertyKey?: string,
    descriptor?: TypedPropertyDescriptor<any>,
  ) => {
    const reflect = new Reflector();
    if (propertyKey && descriptor) {
      // method
      const existingValue = reflect.get<string[]>(key, descriptor.value) ?? [];
      const newValue = [...existingValue, value];
      SetMetadata(key, newValue)(target, propertyKey, descriptor);
    } else {
      // class
      const existingValue = reflect.get<string[]>(key, target) ?? [];
      const newValue = [...existingValue, value];
      SetMetadata(key, newValue)(target);
    }
  };
}

export const Permission = (permission: string) =>
  merge(PERMISSION_KEY, permission);

export const Read = () =>
  merge(PERMISSION_KEY, Action.Read.toLocaleLowerCase());
export const Create = () =>
  merge(PERMISSION_KEY, Action.Create.toLocaleLowerCase());
export const Update = () =>
  merge(PERMISSION_KEY, Action.Update.toLocaleLowerCase());
export const Delete = () =>
  merge(PERMISSION_KEY, Action.Delete.toLocaleLowerCase());
