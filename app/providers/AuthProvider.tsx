'use client'

import { createContext, useContext, ReactNode } from 'react'
// in ./app/providers/AuthProvider.tsx
import { useAuth } from '@/app/hooks/useAuth';
import { User } from '@/app/types/auth'

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  signUp: (email: string, password: string, metadata?: { username?: string; full_name?: string; [key: string]: string | undefined }) => Promise<{ data: { user?: User; session?: unknown } | null; error: string | null }>
  signIn: (email: string, password: string) => Promise<{ data: { user?: User; session?: unknown } | null; error: string | null }>
  signOut: () => Promise<void>
  resetPassword: () => Promise<{ error: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth()

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}