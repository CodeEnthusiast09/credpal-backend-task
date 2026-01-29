export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: ErrorDetail[];
}

export interface ErrorDetail {
  field?: string;
  message: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
