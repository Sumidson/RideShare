"use client"
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function DebugPage() {
    const [status, setStatus] = useState<string>('Idle')
    const [error, setError] = useState<string | null>(null)
    const [config, setConfig] = useState<{ url?: string; keyLength?: number } | null>(null)

    useEffect(() => {
        // Check config on mount
        setConfig({
            url: process.env.NEXT_PUBLIC_SUPABASE_URL,
            keyLength: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length
        })
    }, [])

    const testConnection = async () => {
        setStatus('Testing connection...')
        setError(null)
        try {
            // Try a simple health check or fetch a public table (if strictly restricted, auth.getSession is better)
            const { error } = await supabase.auth.getSession()
            if (error) throw error
            setStatus('Success! Connected to Supabase.')
        } catch (err) {
            console.error('Connection failed:', err)
            setError(err instanceof Error ? err.message : 'Unknown error')
            setStatus('Failed')
        }
    }

    const clearStorage = () => {
        try {
            localStorage.clear()
            sessionStorage.clear()
            setStatus('Storage cleared. Please reload the page.')
            window.location.reload()
        } catch (err) {
            setError('Failed to clear storage: ' + (err instanceof Error ? err.message : String(err)))
        }
    }

    return (
        <div className="p-8 max-w-2xl mx-auto space-y-8">
            <h1 className="text-2xl font-bold">Supabase Debug Interface</h1>

            <div className="p-4 bg-gray-100 rounded-lg">
                <h2 className="font-semibold mb-2">Configuration Detected</h2>
                <pre className="text-sm overflow-auto">
                    {JSON.stringify(config, null, 2)}
                </pre>
            </div>

            <div className="space-y-4">
                <div className="flex gap-4">
                    <button
                        onClick={testConnection}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Test Connection
                    </button>
                    <button
                        onClick={clearStorage}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        Clear Local Storage & Reload
                    </button>
                </div>

                <div className="p-4 border rounded-lg">
                    <p><strong>Status:</strong> {status}</p>
                    {error && (
                        <div className="mt-2 p-2 bg-red-50 text-red-700 border border-red-200 rounded">
                            <strong>Error:</strong> {error}
                        </div>
                    )}
                </div>
            </div>

            <div className="text-sm text-gray-500">
                <p>If &quot;Test Connection&quot; fails with &quot;Failed to fetch&quot;, it usually means:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Your internet connection is unstable or blocking the Supabase domain.</li>
                    <li>The Supabase project is paused (check dashboard).</li>
                    <li>The URL in .env is incorrect.</li>
                </ul>
            </div>
        </div>
    )
}
