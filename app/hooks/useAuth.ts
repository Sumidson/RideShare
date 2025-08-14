'use client'

import { useState, useEffect } from 'react'
import { User } from '@/app/types/auth'
import { apiClient } from '@/app/lib/api'

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
          } else if (data?.user) {
            setUser(data.user as User)
          }
        }
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    initialize()
  }, [])

  const signUp = async (email: string, password: string, metadata?: any) => {
    try {
      setLoading(true)
      setError(null)
      const { data, error } = await apiClient.signup(email, password, metadata?.username, metadata?.full_name)
      return { data, error: error ?? null }
    } catch (err: any) {
      setError(err.message)
      return { data: null, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)
      const { data, error } = await apiClient.login(email, password)
      if (error) {
        setError(error)
        return { data: null, error }
      }
      if (data?.token) {
        apiClient.setToken(data.token)
        if (typeof window !== 'undefined') {
          localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, data.token)
        }
      }
      if (data?.user) {
        setUser(data.user as User)
      }
      return { data, error: null }
    } catch (err: any) {
      setError(err.message)
      return { data: null, error: err.message }
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
    } catch (err: any) {
      setError(err.message)
    }
  }

  const resetPassword = async (_email: string) => {
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