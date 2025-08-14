'use client'

import { useState, useEffect } from 'react'
// Removed unused legacy supabase auth; using context-based auth
import { useAuthContext } from '@/app/providers/AuthProvider'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  type DashboardUser = { id: string; email: string; full_name?: string }
  const [user, setUser] = useState<DashboardUser | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const { user: ctxUser, signOut } = useAuthContext()

  useEffect(() => {
    if (!ctxUser) {
      router.push('/login')
    } else {
      setUser(ctxUser)
    }
    setLoading(false)
  }, [ctxUser, router])

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/login')
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">
                  {user.full_name || user.email}
                </span>
              </div>
              <button
                onClick={handleSignOut}
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Welcome to your Dashboard!
              </h2>
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-600">Email:</span>
                  <span className="ml-2 text-gray-900">{user.email}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Name:</span>
                  <span className="ml-2 text-gray-900">
                    {user.full_name || 'Not provided'}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">User ID:</span>
                  <span className="ml-2 text-gray-900 font-mono text-sm">{user.id}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Last Sign In:</span>
                  <span className="ml-2 text-gray-900">
                    {/* Placeholder for last sign-in */}
                    N/A
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}