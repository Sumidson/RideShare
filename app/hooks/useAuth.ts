'use client'

import { useState, useEffect } from 'react'
import { User } from '@/app/types/auth'
import { apiClient } from '@/app/lib/api'

// Define interfaces for better type safety
interface SignUpMetadata {
  username?: string
  full_name?: string
  [key: string]: string | undefined
}

interface ApiLoginResponse {
  token?: string
  user?: User
}

interface AuthResponse {
  data: { user?: User; session?: unknown } | null
  error: string | null
}


const LOCAL_STORAGE_TOKEN_KEY = 'carpooling_jwt'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initialize = async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY) : null
        if (token) {
          apiClient.setToken(token)
          const { data, error } = await apiClient.getProfile()
          if (error) {
            setError(error)
          } else if (data) {
            setUser(data as User)
          }
        }
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred'
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }
    initialize()
  }, [])

  const signUp = async (email: string, password: string, metadata?: SignUpMetadata): Promise<AuthResponse> => {
    try {
      setLoading(true)
      setError(null)
      const { data, error } = await apiClient.signup(email, password, metadata?.username, metadata?.full_name)
      return { data: data as { user?: User; session?: unknown } | null, error: error ?? null }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred'
      setError(errorMessage)
      return { data: null, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      setLoading(true)
      setError(null)
      const { data, error } = await apiClient.login(email, password)
      if (error) {
        setError(error)
        return { data: null, error }
      }
      if ((data as ApiLoginResponse)?.token) {
        apiClient.setToken((data as ApiLoginResponse).token!)
        if (typeof window !== 'undefined') {
          localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, (data as ApiLoginResponse).token!)
        }
      }
      if ((data as ApiLoginResponse)?.user) {
        setUser((data as ApiLoginResponse).user!)
      }
      return { data: data as { user?: User; session?: unknown } | null, error: null }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred'
      setError(errorMessage)
      return { data: null, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      apiClient.clearToken()
      if (typeof window !== 'undefined') {
        localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY)
      }
      setUser(null)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred'
      setError(errorMessage)
    }
  }

  const resetPassword = async (): Promise<{ error: string }> => {
    return { error: 'Password reset is not available.' }
  }

  return {
    user,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    resetPassword
  }
}