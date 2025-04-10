/**
 * @description: 全局响应体
 */
export type Response<T = any> = {
  code: number; // 状态码
  data?: T; // 业务数据
  message: string; // 响应信息
  timestamp: number; // 时间戳
  details?: string[];
};
/**
 * @description: 分页数据
 */
export type PageResponse<T = any> = {
  current?: number; // 页码
  size?: number; // 当前页条数
  total?: number; // 总条数
  records: T[]; // 业务数据
};

// 统一成功响应的数据结构
export interface SuccessResponse<T> {
  code: number;
  message: string;
  data: T;
}

// 统一错误响应的数据结构
export interface ErrorResponse {
  code: number;
  message: string;
}

// 统一分页响应的数据结构
export interface PaginatedResponse<T> {
  code: number;
  message: string;
  data: T[];
  total: number;
}
