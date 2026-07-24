import { createContext } from 'react'
import type { LoginRequest, RegisterRequest } from '../lib/api'

export interface AuthUser {
  userId: string
  email: string
}

export interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (body: LoginRequest) => Promise<void>
  register: (body: RegisterRequest) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
