const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

export const TOKEN_KEY = 'pantrypal.token'

export interface TokenResponse {
  accessToken: string
  tokenType: string
  expiresAt: string
}

export interface RegisterRequest {
  email: string
  password: string
  displayName?: string
}

export interface LoginRequest {
  email: string
  password: string
}

/** Mirrors the backend RFC 7807 ProblemDetail responses. */
export class ApiError extends Error {
  readonly status: number
  readonly fieldErrors: Record<string, string>

  constructor(status: number, detail: string, fieldErrors: Record<string, string> = {}) {
    super(detail)
    this.name = 'ApiError'
    this.status = status
    this.fieldErrors = fieldErrors
  }
}

interface ProblemDetail {
  detail?: string
  title?: string
  errors?: Record<string, string>
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem(TOKEN_KEY)
  const headers = new Headers(options.headers)
  headers.set('Content-Type', 'application/json')
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${API_BASE}${path}`, { ...options, headers })

  if (!response.ok) {
    let problem: ProblemDetail = {}
    try {
      problem = await response.json()
    } catch {
      // non-JSON error body (e.g. an empty 401) — fall through with defaults
    }
    throw new ApiError(
      response.status,
      problem.detail ?? problem.title ?? `Request failed (${response.status})`,
      problem.errors ?? {},
    )
  }

  if (response.status === 204) {
    return undefined as T
  }
  return response.json() as Promise<T>
}

export const authApi = {
  register: (body: RegisterRequest) =>
    request<TokenResponse>('/api/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body: LoginRequest) =>
    request<TokenResponse>('/api/auth/login', { method: 'POST', body: JSON.stringify(body) }),
}
