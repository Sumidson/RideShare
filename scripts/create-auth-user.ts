import { createClient } from '@supabase/supabase-js'
import { loadEnvConfig } from '@next/env'

// Load environment variables reliably using Next.js helper
const projectDir = process.cwd()
loadEnvConfig(projectDir)

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!url || !key) {
    console.error('❌ Missing Supabase credentials in .env file')
    process.exit(1)
}

const supabase = createClient(url, key)

async function createTestUser() {
    const email = 'testuser@example.com'
    const password = 'password123'

    console.log(`Attempting to create user: ${email}`)

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: 'Test User',
            }
        }
    })

    if (error) {
        console.error('❌ Error creating user:', error.message)
        if (error.message.includes('already registered')) {
            console.log('ℹ️ User already exists. Try logging in with these credentials.')
        }
    } else {
        console.log('✅ User created successfully!')
        console.log('User ID:', data.user?.id)
        console.log('Email:', data.user?.email)

        if (data.session) {
            console.log('✅ Session created immediately (Email confirmation might be off).')
        } else {
            console.log('⚠️ No session created. You might need to confirm your email.')
            console.log('   Check your Supabase Authentication -> URL Configuration settings.')
        }
    }
}

createTestUser()
