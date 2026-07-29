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

export interface PantryItem {
  id: number
  name: string
  quantity: number | null
  unit: string | null
  category: string | null
  expiresAt: string | null
  createdAt: string
  updatedAt: string
}

export interface CreatePantryItemRequest {
  name: string
  quantity?: number
  unit?: string
  category?: string
  expiresAt?: string
}

export type UpdatePantryItemRequest = CreatePantryItemRequest

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

export const pantryApi = {
  list: () => request<PantryItem[]>('/api/pantry'),
  get: (id: number) => request<PantryItem>(`/api/pantry/${id}`),
  create: (body: CreatePantryItemRequest) =>
    request<PantryItem>('/api/pantry', { method: 'POST', body: JSON.stringify(body) }),
  update: (id: number, body: UpdatePantryItemRequest) =>
    request<PantryItem>(`/api/pantry/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (id: number) => request<void>(`/api/pantry/${id}`, { method: 'DELETE' }),
}

export interface RecipeMatch {
  id: number
  title: string
  description: string
  prepTimeMinutes: number
  cookTimeMinutes: number
  servings: number
  difficulty: string
  matchedIngredients: string[]
  missingIngredients: string[]
  matchPercentage: number
  canMake: boolean
}

export interface RecipeIngredientDetail {
  id: number
  name: string
  quantity: number | null
  unit: string | null
  isOptional: boolean
  isAvailable: boolean
}

export interface RecipeDetail {
  id: number
  title: string
  description: string
  instructions: string
  prepTimeMinutes: number
  cookTimeMinutes: number
  servings: number
  difficulty: string
  ingredients: RecipeIngredientDetail[]
  matchPercentage: number
  canMake: boolean
}

export const recipeApi = {
  findMatching: () => request<RecipeMatch[]>('/api/recipes/match'),
  getDetail: (id: number) => request<RecipeDetail>(`/api/recipes/${id}`),
}

