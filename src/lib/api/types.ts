export type UserRole = 'ADMIN' | 'COACH' | 'TRAINER' | 'STUDENT';
export type UiLocale = 'ro' | 'en';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface MeResponse {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role: UserRole;
  language: string;
}

export type SessionType = 'TENNIS' | 'FITNESS' | 'MATCHPLAY';
export type AttendanceStatus = 'PRESENT' | 'LATE' | 'ABSENT';
export type MembershipStatus = 'PAID' | 'DUE' | 'WAIVED';
export type StudentStatus = 'ACTIVE' | 'INACTIVE';

export interface SessionStudentInfo {
  id: string;
  firstName: string;
  lastName: string;
}

export interface SessionCourtInfo {
  id: number;
  name: string;
}

export interface SessionStaffInfo {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
}

export interface SessionDto {
  id: string;
  startAt: string;
  endAt: string;
  court: SessionCourtInfo;
  staffUser: SessionStaffInfo;
  sessionType: SessionType;
  title?: string;
  students: SessionStudentInfo[];
}

export interface SessionMetricItem {
  studentId: string;
  firstName: string;
  lastName: string;
  attendanceStatus: AttendanceStatus;
  durationMinutes?: number;
  rpe?: number;
  load?: number;
  internalNotes?: string;
  studentNotes?: string;
}

export interface SessionMetricsResponse {
  sessionId: string;
  items: SessionMetricItem[];
}

export interface CompleteSessionItemRequest {
  studentId: string;
  attendanceStatus: AttendanceStatus;
  durationMinutes?: number;
  rpe?: number;
  internalNotes?: string;
  studentNotes?: string;
}

export interface CompleteSessionRequest {
  items: CompleteSessionItemRequest[];
}

export interface MyScheduleSessionResponse {
  sessionId: string;
  startAt: string;
  endAt: string;
  courtName: string;
  staffName: string;
  sessionType: SessionType;
  title?: string;
}

export interface MyScheduleWeekResponse {
  sessions: MyScheduleSessionResponse[];
}

export interface MyHistoryItemResponse {
  sessionId: string;
  startAt: string;
  endAt: string;
  courtName: string;
  staffName: string;
  sessionType: SessionType;
  title?: string;
  attendanceStatus?: AttendanceStatus;
  durationMinutes?: number;
  rpe?: number;
  load?: number;
  studentNotes?: string;
}

export interface MyHistoryResponse {
  items: MyHistoryItemResponse[];
  total: number;
}

export interface StudentDto {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  phone?: string;
  status: StudentStatus;
  notes?: string;
  userId?: string;
}

export interface CreateAccountResponse {
  userId: string;
  temporaryPassword: string;
}

export interface BillingStudentRow {
  studentId: string;
  firstName: string;
  lastName: string;
  membershipId?: string;
  status: MembershipStatus;
  amount?: number;
  dueDate?: string;
  paidAt?: string;
}

export interface ApiProblem {
  title?: string;
  detail?: string;
  status?: number;
  code?: string;
  [key: string]: unknown;
}

