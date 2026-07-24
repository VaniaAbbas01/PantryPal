import { useCallback, useEffect, useMemo, useState } from 'react'
import { authApi, TOKEN_KEY } from '../lib/api'
import type { LoginRequest, RegisterRequest } from '../lib/api'
import { AuthContext } from './authContext'
import type { AuthUser } from './authContext'

/** Decodes a JWT payload without verifying it — used only to render the current user. */
function decodeUser(token: string): AuthUser | null {
  try {
    const payload = token.split('.')[1]
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    const claims = JSON.parse(json) as { sub?: string; email?: string; exp?: number }
    if (!claims.sub) return null
    if (claims.exp && claims.exp * 1000 < Date.now()) return null
    return { userId: claims.sub, email: claims.email ?? '' }
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    return token ? decodeUser(token) : null
  })

  // Drop an expired/invalid token discovered at startup.
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (token && !decodeUser(token)) {
      localStorage.removeItem(TOKEN_KEY)
    }
  }, [])

  const persist = useCallback((token: string) => {
    localStorage.setItem(TOKEN_KEY, token)
    setUser(decodeUser(token))
  }, [])

  const login = useCallback(
    async (body: LoginRequest) => {
      const { accessToken } = await authApi.login(body)
      persist(accessToken)
    },
    [persist],
  )

  const register = useCallback(
    async (body: RegisterRequest) => {
      const { accessToken } = await authApi.register(body)
      persist(accessToken)
    },
    [persist],
  )

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ user, isAuthenticated: user !== null, login, register, logout }),
    [user, login, register, logout],
  )

  return <AuthContext value={value}>{children}</AuthContext>
}
