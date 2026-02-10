const isServer = typeof window === 'undefined'
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || (isServer ? 'http://localhost:3000/api' : '/api')
import { supabase } from '@/lib/supabase'
import { User, Session } from '@supabase/supabase-js'

interface ApiResponse<T = unknown> {
  data?: T
  error?: string
  message?: string
}

class ApiClient {
  private token: string | null = null

  setToken(token: string) {
    this.token = token
  }

  clearToken() {
    this.token = null
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`

    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    }

    // Add any additional headers from options
    if (options.headers) {
      if (options.headers instanceof Headers) {
        options.headers.forEach((value, key) => {
          headers[key] = value
        })
      } else if (Array.isArray(options.headers)) {
        options.headers.forEach(([key, value]) => {
          headers[key] = value
        })
      } else {
        Object.assign(headers, options.headers)
      }
    }

    // Automatically get token from Supabase if not manually set
    if (!this.token) {
      const { data } = await supabase.auth.getSession()
      if (data.session?.access_token) {
        this.token = data.session.access_token
      }
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers
      })

      const data = await response.json()

      // Handle 401 specifically
      if (response.status === 401) {
        // Optional: Trigger logout or redirect to login
        console.error('Unauthorized access:', data.error || 'Unknown error')
      }

      if (!response.ok) {
        return { error: data.error || 'Request failed' }
      }

      return { data }
    } catch {
      return { error: 'Network error' }
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request<{ user: User; session: Session }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    })
  }

  async signup(email: string, password: string, username?: string, full_name?: string) {
    return this.request<{ user: User; session: Session }>('/auth/sign-up', {
      method: 'POST',
      body: JSON.stringify({ email, password, username, full_name })
    })
  }

  // Rides endpoints
  async getRides(params?: {
    origin?: string
    destination?: string
    date?: string
    page?: number
    limit?: number
  }) {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString())
        }
      })
    }

    const qs = searchParams.toString()
    return this.request(`/rides${qs ? `?${qs}` : ''}`)
  }

  async getRide(id: string) {
    return this.request(`/rides/${id}`)
  }

  async createRide(data: {
    origin: string
    destination: string
    departure_time: string
    available_seats: number
    price_per_seat: number
    description?: string
  }) {
    return this.request('/rides', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  async updateRide(id: string, data: Partial<{
    origin: string
    destination: string
    departure_time: string
    available_seats: number
    price_per_seat: number
    description: string
    status: 'ACTIVE' | 'CANCELLED' | 'COMPLETED' | 'IN_PROGRESS'
  }>) {
    return this.request(`/rides/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  async deleteRide(id: string) {
    return this.request(`/rides/${id}`, {
      method: 'DELETE'
    })
  }

  // Bookings endpoints
  async createBooking(data: {
    ride_id: string
    seats_booked: number
  }) {
    return this.request('/bookings', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  async getBookings(params?: {
    status?: string
    page?: number
    limit?: number
  }) {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString())
        }
      })
    }

    return this.request(`/bookings?${searchParams.toString()}`)
  }

  async getBooking(id: string) {
    return this.request(`/bookings/${id}`)
  }

  async updateBooking(id: string, data: {
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'
  }) {
    return this.request(`/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  async cancelBooking(id: string) {
    return this.request(`/bookings/${id}`, {
      method: 'DELETE'
    })
  }

  // User profile endpoints
  async getProfile() {
    return this.request('/users/profile')
  }

  async updateProfile(data: Partial<{
    username: string
    full_name: string
    phone: string
    bio: string
    avatar_url: string
  }>) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  // Reviews endpoints
  async createReview(data: {
    reviewed_user_id: string
    ride_id: string
    rating: number
    comment?: string
  }) {
    return this.request('/reviews', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  async getReviews(userId: string, params?: {
    page?: number
    limit?: number
  }) {
    const searchParams = new URLSearchParams({ user_id: userId })
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString())
        }
      })
    }

    return this.request(`/reviews?${searchParams.toString()}`)
  }
}

export const apiClient = new ApiClient()