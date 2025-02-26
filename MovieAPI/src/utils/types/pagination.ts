export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

export interface PaginationResponse<T> {
  data: T;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
