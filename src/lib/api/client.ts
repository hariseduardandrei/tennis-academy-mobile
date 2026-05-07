import { authStorage } from '@/lib/auth/storage';
import { getApiBaseUrl } from '@/lib/config/runtime-config';

import type { ApiProblem } from './types';

export class ApiError extends Error {
  status: number;
  body: ApiProblem;

  constructor(status: number, body: ApiProblem) {
    super(body.detail ?? body.title ?? `HTTP ${status}`);
    this.status = status;
    this.body = body;
  }
}

let unauthorizedHandler: (() => Promise<void>) | null = null;

export function registerUnauthorizedHandler(handler: () => Promise<void>): void {
  unauthorizedHandler = handler;
}

async function parseBody(res: Response): Promise<unknown> {
  if (res.status === 204) return undefined;
  const contentType = res.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) return res.json();
  return res.text();
}

async function request<T>(
  path: string,
  init: RequestInit = {},
  authenticated = true,
): Promise<T> {
  const token = authenticated ? await authStorage.getToken() : null;
  const baseUrl = await getApiBaseUrl();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init.headers as Record<string, string>),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${baseUrl}${path}`, { ...init, headers });
  const data = await parseBody(response);

  if (!response.ok) {
    if (response.status === 401 && unauthorizedHandler) {
      await unauthorizedHandler();
    }

    throw new ApiError(response.status, (data as ApiProblem) ?? { detail: String(data) });
  }

  return data as T;
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
  postPublic: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }, false),
};

