import type { ApiResponse } from "@/types/api";

export class ResourceApiError extends Error {
  fieldErrors?: Record<string, string[]>;

  constructor(message: string, fieldErrors?: Record<string, string[]>) {
    super(message);
    this.name = "ResourceApiError";
    this.fieldErrors = fieldErrors;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  const result = (await response.json()) as ApiResponse<T>;

  if (!result.success) {
    throw new ResourceApiError(result.error.message, result.error.fieldErrors);
  }
  return result.data;
}

/**
 * One typed CRUD client per admin resource, generated from its base API
 * path — every admin feature's create/edit form calls the same four
 * methods instead of hand-writing fetch() and error handling per entity.
 */
export function createResourceClient<TRecord, TInput = unknown>(basePath: string) {
  return {
    list: () => request<TRecord[]>(basePath),
    get: (id: string) => request<TRecord>(`${basePath}/${id}`),
    create: (input: TInput) => request<TRecord>(basePath, { method: "POST", body: JSON.stringify(input) }),
    update: (id: string, input: Partial<TInput>) =>
      request<TRecord>(`${basePath}/${id}`, { method: "PATCH", body: JSON.stringify(input) }),
    remove: (id: string) => request<{ id: string }>(`${basePath}/${id}`, { method: "DELETE" }),
  };
}
