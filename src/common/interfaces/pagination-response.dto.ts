export interface PaginationResponseDto<T> {
  items: T[];
  meta: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}
