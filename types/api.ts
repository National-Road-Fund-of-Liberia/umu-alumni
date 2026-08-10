export interface ApiError {
  message: string;
  code?: string;
  fieldErrors?: Record<string, string[]>;
}

export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: ApiError };
