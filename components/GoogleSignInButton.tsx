// components/GoogleSignInButton.tsx
'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'

export default function GoogleSignInButton() {
  const [loading, setLoading] = useState(false)

  async function signInWithGoogle() {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      })
      
      if (error) {
        console.error('Error signing in with Google:', error.message)
        alert('Failed to sign in with Google. Please try again.')
      }
    } catch (err) {
      console.error('Unexpected error:', err)
      alert('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button 
      onClick={signInWithGoogle}
      disabled={loading}
      className="px-4 py-2 border flex gap-2 border-slate-200 rounded-lg text-slate-700 hover:border-slate-400 hover:text-slate-900 hover:shadow transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Image className="w-6 h-6" src="https://www.svgrepo.com/show/475656/google-color.svg" width={24} height={24} alt="google logo" />
      <span>{loading ? 'Signing in...' : 'Login with Google'}</span>
    </button>
  )
}