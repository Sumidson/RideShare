'use client'

import { useSupabaseAuth } from '@/app/providers/SupabaseAuthProvider'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AdminPage() {
  const { user, loading } = useSupabaseAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome to the admin dashboard. This page is under construction.
          </p>
          
          <div className="mt-6">
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h3 className="text-sm font-medium text-blue-800">
                User Information
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>Email: {user.email}</p>
                <p>ID: {user.id}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}