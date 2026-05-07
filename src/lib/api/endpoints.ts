import { apiClient } from './client';
import type {
  BillingStudentRow,
  CompleteSessionRequest,
  CreateAccountResponse,
  LoginRequest,
  LoginResponse,
  MeResponse,
  MyHistoryResponse,
  MyScheduleWeekResponse,
  SessionDto,
  SessionMetricsResponse,
  StudentDto,
  MembershipStatus,
} from './types';

function normalizeList<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[];
  if (!payload || typeof payload !== 'object') return [];
  const data = payload as Record<string, unknown>;
  if (Array.isArray(data.items)) return data.items as T[];
  if (Array.isArray(data.content)) return data.content as T[];
  if (Array.isArray(data.rows)) return data.rows as T[];
  if (Array.isArray(data.data)) return data.data as T[];
  return [];
}

export const authApi = {
  login: (req: LoginRequest) => apiClient.postPublic<LoginResponse>('/auth/login', req),
  me: () => apiClient.get<MeResponse>('/me'),
};

export const portalApi = {
  getScheduleWeek: (start: string) =>
    apiClient.get<MyScheduleWeekResponse>(`/my/schedule/week?start=${start}`),
  getHistory: (limit = 20, offset = 0) =>
    apiClient.get<MyHistoryResponse>(`/my/history?limit=${limit}&offset=${offset}`),
};

export const sessionsApi = {
  listWeek: async (start: string): Promise<SessionDto[]> => {
    const payload = await apiClient.get<unknown>(`/schedule/week?start=${start}`);
    return normalizeList<SessionDto>(payload);
  },
  getMetrics: (id: string) => apiClient.get<SessionMetricsResponse>(`/sessions/${id}/metrics`),
  complete: (id: string, req: CompleteSessionRequest) =>
    apiClient.post<void>(`/sessions/${id}/complete`, req),
};

export const billingApi = {
  getMonth: async (year: number, month: number): Promise<BillingStudentRow[]> => {
    const payload = await apiClient.get<unknown>(`/billing/month?year=${year}&month=${month}`);
    return normalizeList<BillingStudentRow>(payload);
  },
  getOverdue: async (year: number, month: number): Promise<BillingStudentRow[]> => {
    const payload = await apiClient.get<unknown>(`/billing/overdue?year=${year}&month=${month}`);
    return normalizeList<BillingStudentRow>(payload);
  },
  patchMonth: (studentId: string, year: number, month: number, status: MembershipStatus) =>
    apiClient.patch<BillingStudentRow>(
      `/billing/students/${studentId}/month?year=${year}&month=${month}`,
      { status },
    ),
};

export const studentsApi = {
  list: async (params?: { status?: string; search?: string }): Promise<StudentDto[]> => {
    const qs = new URLSearchParams();
    if (params?.status) qs.set('status', params.status);
    if (params?.search) qs.set('search', params.search);
    const query = qs.toString();
    const payload = await apiClient.get<unknown>(`/students${query ? `?${query}` : ''}`);
    return normalizeList<StudentDto>(payload);
  },
  get: (id: string) => apiClient.get<StudentDto>(`/students/${id}`),
  createAccount: (id: string) =>
    apiClient.post<CreateAccountResponse>(`/students/${id}/create-account`, {}),
};

