export interface User {
    id: string
    email: string
    username?: string
    full_name?: string
    avatar_url?: string
    role: 'USER' | 'ADMIN' | 'MODERATOR'
    email_verified: boolean
    created_at: string
    updated_at: string
  }
  
  export interface AuthState {
    user: User | null
    loading: boolean
    error: string | null
  }
  
  export interface LoginCredentials {
    email: string
    password: string
  }
  
  export interface RegisterCredentials {
    email: string
    password: string
    username?: string
    full_name?: string
  }
  
  export interface AuthResponse {
    user?: User
    session?: string
    error?: string
  }