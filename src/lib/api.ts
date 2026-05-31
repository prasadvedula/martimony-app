// API client — all requests go to the Express backend

const BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'

function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('auth_token')
}

function authHeaders(): Record<string, string> {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit & { auth?: boolean } = {}
): Promise<T> {
  const { auth = false, headers = {}, ...rest } = options
  const res = await fetch(`${BASE}${path}`, {
    ...rest,
    headers: {
      ...(rest.body && !(rest.body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}),
      ...(auth ? authHeaders() : {}),
      ...(headers as Record<string, string>),
    },
  })
  const data = await res.json()
  return data as T
}

// ── Auth ──────────────────────────────────────────────────────────
export const authApi = {
  login:    (email: string, password: string) =>
    apiFetch<{ success: boolean; token?: string; user?: UserData; error?: string }>(
      '/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  register: (name: string, email: string, password: string, adminSecret?: string) =>
    apiFetch<{ success: boolean; token?: string; user?: UserData; error?: string }>(
      '/api/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password, adminSecret }) }),

  me: () => apiFetch<{ success: boolean; user?: UserData }>('/api/auth/me', { auth: true }),
}

// ── Profiles ──────────────────────────────────────────────────────
export const profilesApi = {
  list:   (params: Record<string, string | number>) => {
    const q = new URLSearchParams()
    Object.entries(params).forEach(([k, v]) => { if (v) q.set(k, String(v)) })
    return apiFetch<ProfileListResponse>(`/api/profiles?${q}`)
  },
  get:    (id: string) => apiFetch<{ success: boolean; data?: ProfileDetail }>(`/api/profiles/${id}`),
  create: (form: FormData) =>
    apiFetch<{ success: boolean; data?: ProfileDetail; error?: string }>(
      '/api/profiles', { method: 'POST', body: form, auth: true }),
}

// ── Match ─────────────────────────────────────────────────────────
export const matchApi = {
  calculate: (body: Record<string, unknown>) =>
    apiFetch<{ success: boolean; data?: unknown; error?: string }>(
      '/api/match', { method: 'POST', body: JSON.stringify(body) }),
}

// ── Upload ────────────────────────────────────────────────────────
export const uploadApi = {
  pdf: (form: FormData) =>
    apiFetch<{ success: boolean; batchId?: string; summary?: unknown; results?: unknown[]; error?: string }>(
      '/api/upload', { method: 'POST', body: form, auth: true }),
}

// ── Consent ───────────────────────────────────────────────────────
export const consentApi = {
  verify: (token: string) => apiFetch<{ success: boolean; data?: unknown; error?: string }>(`/api/consent/${token}`),
  respond:(token: string, action: 'ACCEPT' | 'REJECT') =>
    apiFetch<{ success: boolean; message?: string; error?: string }>(
      `/api/consent/${token}`, { method: 'POST', body: JSON.stringify({ action }) }),
}

// ── Astro ─────────────────────────────────────────────────────────
export const astroApi = {
  calculate: (body: { dateOfBirth: string; birthTime?: string; birthPlace: string }) =>
    apiFetch<{ success: boolean; data?: AstroResult; error?: string }>(
      '/api/astro/calculate', { method: 'POST', body: JSON.stringify(body) }),
}

// ── Admin ─────────────────────────────────────────────────────────
export const adminApi = {
  stats:    () => apiFetch<{ success: boolean; data?: AdminStats }>('/api/admin/stats', { auth: true }),
  pending:  () => apiFetch<{ success: boolean; data?: PendingProfile[] }>('/api/admin/pending', { auth: true }),
  activate: (id: string) =>
    apiFetch<{ success: boolean; data?: unknown; error?: string }>(
      `/api/admin/profiles/${id}/activate`, { method: 'PATCH', auth: true }),
}

// ── Types ─────────────────────────────────────────────────────────
export interface UserData {
  id: string; email: string; name: string; role: string
}
export interface ProfileSummary {
  id: string; name: string; gender: string; dateOfBirth: string
  caste: string; subCaste?: string; nakshatra: string; rashi?: string
  currentCity?: string; currentState?: string; photoUrl?: string
  education?: string; occupation?: string; heightCm?: number
  mangalDosha?: boolean; gotram?: string; birthPlace: string
}
export interface ProfileDetail extends ProfileSummary {
  birthTime?: string; sakha?: string; kuladeviTemple?: string
  surname?: string; complexion?: string; bodyType?: string
  educationDetail?: string; occupationDetail?: string; annualIncomeLpa?: number
  fatherName?: string; fatherOccupation?: string; motherName?: string; motherOccupation?: string
  siblings?: string; familyType?: string; familyValues?: string
  contactEmail?: string; contactPhone?: string
  prefAgeMin?: number; prefAgeMax?: number; prefCastes: string[]; prefStates: string[]
}
export interface ProfileListResponse {
  success: boolean
  data: ProfileSummary[]
  pagination: { page: number; pages: number; total: number; limit: number }
}
export interface AdminStats {
  total: number; active: number; pendingConsent: number; rejected: number; male: number; female: number
}
export interface AstroResult {
  nakshatra: string
  rasi: string
  mangalDosha: boolean
  coordinates: { lat: number; lon: number }
  planets: {
    sun: string; moon: string; mars: string; mercury: string
    jupiter: string; venus: string; saturn: string
    rahu: string; ketu: string; lagna: string
  }
}

export interface PendingProfile {
  id: string; name: string; gender: string; dateOfBirth: string
  caste: string; nakshatra: string; contactEmail?: string; contactPhone?: string
  consentToken?: string; createdAt: string; uploadedByAdmin: boolean
}
