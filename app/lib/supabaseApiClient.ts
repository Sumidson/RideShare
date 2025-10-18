import { supabase } from '@/lib/supabase'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

interface ApiResponse<T = any> {
  data?: T
  error?: string
  message?: string
}

class SupabaseApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>)
    }

    // Get the current session token
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers
      })

      const data = await response.json()

      if (!response.ok) {
        return { error: data.error || 'Request failed' }
      }

      return { data }
    } catch (error) {
      return { error: 'Network error' }
    }
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

export const supabaseApiClient = new SupabaseApiClient()