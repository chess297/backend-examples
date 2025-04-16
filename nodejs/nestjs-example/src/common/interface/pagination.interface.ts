export interface PaginationInterface {
  page?: number;
  limit?: number;
}

export interface PaginationResultInterface<T> {
  data: T[];
  total: number;
  page: number;
}
