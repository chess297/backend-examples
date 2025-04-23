/**
 * 从 Prisma 模型生成 CASL 主体对象
 * @param model Prisma 模型名称
 * @param object 模型实例或属性
 * @returns 带有 modelName 标记的 CASL 主体对象
 */
interface PrismaSubject {
  modelName: string;
  [key: string]: any;
}

export function createPrismaSubject(
  model: string,
  object: Record<string, any> = {},
): PrismaSubject {
  return {
    modelName: model,
    ...object,
  };
}

/**
 * 检查一个对象是否为带有 modelName 的 CASL 主体
 * @param object 要检查的对象
 * @returns 是否是 CASL 主体
 */
export function isPrismaSubject(object: any): boolean {
  return !!(object && typeof object === 'object' && 'modelName' in object);
}

/**
 * 从 Prisma 模型创建多个 CASL 主体对象
 * @param model Prisma 模型名称
 * @param objects 模型实例或属性数组
 * @returns 带有 modelName 标记的 CASL 主体对象数组
 */
export function createPrismaSubjects(model: string, objects: any[] = []) {
  return objects.map((object) => createPrismaSubject(model, object));
}
