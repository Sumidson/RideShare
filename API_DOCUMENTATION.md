# Carpooling App API Documentation

## Overview

This is the backend API for the carpooling application. It provides endpoints for user authentication, ride management, bookings, reviews, and user profiles.

## Base URL

```
http://localhost:3000/api
```

## Authentication

Most endpoints require authentication via JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### Authentication

#### POST /auth/sign-up
Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "username": "johndoe",
  "full_name": "John Doe"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "johndoe",
    "full_name": "John Doe"
  }
}
```

#### POST /auth/login
Authenticate a user and get a JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "johndoe"
  },
  "token": "jwt-token"
}
```

### Rides

#### GET /rides
Get all available rides with optional filtering.

**Query Parameters:**
- `origin` (optional): Filter by origin location
- `destination` (optional): Filter by destination location
- `date` (optional): Filter by departure date (YYYY-MM-DD)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**
```json
{
  "rides": [
    {
      "id": "uuid",
      "origin": "Downtown",
      "destination": "Airport",
      "departure_time": "2024-01-15T10:00:00Z",
      "available_seats": 3,
      "price_per_seat": 15.0,
      "description": "Heading to airport",
      "status": "ACTIVE",
      "driver": {
        "id": "uuid",
        "username": "johndoe",
        "full_name": "John Doe",
        "avatar_url": "https://...",
        "rating": 4.5,
        "total_rides": 25
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

#### POST /rides
Create a new ride (requires authentication).

**Request Body:**
```json
{
  "origin": "Downtown",
  "destination": "Airport",
  "departure_time": "2024-01-15T10:00:00Z",
  "available_seats": 4,
  "price_per_seat": 15.0,
  "description": "Heading to airport"
}
```

#### GET /rides/{id}
Get a specific ride by ID.

**Response:**
```json
{
  "id": "uuid",
  "origin": "Downtown",
  "destination": "Airport",
  "departure_time": "2024-01-15T10:00:00Z",
  "available_seats": 3,
  "price_per_seat": 15.0,
  "description": "Heading to airport",
  "status": "ACTIVE",
  "driver": {
    "id": "uuid",
    "username": "johndoe",
    "full_name": "John Doe",
    "avatar_url": "https://...",
    "rating": 4.5,
    "total_rides": 25,
    "phone": "+1234567890"
  },
  "bookings": [
    {
      "id": "uuid",
      "seats_booked": 1,
      "status": "CONFIRMED",
      "passenger": {
        "id": "uuid",
        "username": "janesmith",
        "full_name": "Jane Smith",
        "avatar_url": "https://..."
      }
    }
  ]
}
```

#### PUT /rides/{id}
Update a ride (only the driver can update their own rides).

**Request Body:**
```json
{
  "origin": "Updated Origin",
  "destination": "Updated Destination",
  "departure_time": "2024-01-15T11:00:00Z",
  "available_seats": 3,
  "price_per_seat": 20.0,
  "description": "Updated description",
  "status": "ACTIVE"
}
```

#### DELETE /rides/{id}
Delete a ride (only the driver can delete their own rides).

### Bookings

#### POST /bookings
Create a new booking (requires authentication).

**Request Body:**
```json
{
  "ride_id": "uuid",
  "seats_booked": 2
}
```

#### GET /bookings
Get user's bookings (requires authentication).

**Query Parameters:**
- `status` (optional): Filter by booking status
- `page` (optional): Page number
- `limit` (optional): Items per page

**Response:**
```json
{
  "bookings": [
    {
      "id": "uuid",
      "seats_booked": 2,
      "total_price": 30.0,
      "status": "PENDING",
      "created_at": "2024-01-10T09:00:00Z",
      "ride": {
        "id": "uuid",
        "origin": "Downtown",
        "destination": "Airport",
        "departure_time": "2024-01-15T10:00:00Z",
        "driver": {
          "id": "uuid",
          "username": "johndoe",
          "full_name": "John Doe",
          "avatar_url": "https://...",
          "rating": 4.5
        }
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "pages": 1
  }
}
```

#### GET /bookings/{id}
Get a specific booking (requires authentication).

#### PUT /bookings/{id}
Update booking status (only drivers can confirm/cancel bookings).

**Request Body:**
```json
{
  "status": "CONFIRMED"
}
```

#### DELETE /bookings/{id}
Cancel a booking (only passengers can cancel their own bookings).

### User Profile

#### GET /users/profile
Get current user's profile (requires authentication).

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "johndoe",
    "full_name": "John Doe",
    "avatar_url": "https://...",
    "phone": "+1234567890",
    "bio": "Friendly driver",
    "rating": 4.5,
    "total_rides": 25,
    "is_verified": true,
    "email_verified": true,
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

#### PUT /users/profile
Update user profile (requires authentication).

**Request Body:**
```json
{
  "username": "newusername",
  "full_name": "John Smith",
  "phone": "+1234567890",
  "bio": "Updated bio",
  "avatar_url": "https://..."
}
```

### Reviews

#### POST /reviews
Create a new review (requires authentication).

**Request Body:**
```json
{
  "reviewed_user_id": "uuid",
  "ride_id": "uuid",
  "rating": 5,
  "comment": "Great ride, very punctual!"
}
```

#### GET /reviews
Get reviews for a specific user.

**Query Parameters:**
- `user_id` (required): ID of the user to get reviews for
- `page` (optional): Page number
- `limit` (optional): Items per page

**Response:**
```json
{
  "reviews": [
    {
      "id": "uuid",
      "rating": 5,
      "comment": "Great ride, very punctual!",
      "created_at": "2024-01-10T09:00:00Z",
      "reviewer": {
        "id": "uuid",
        "username": "janesmith",
        "full_name": "Jane Smith",
        "avatar_url": "https://..."
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 15,
    "pages": 2
  }
}
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "error": "Error message description"
}
```

Common HTTP status codes:
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (authentication required)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `500`: Internal Server Error

## Database Schema

The application uses PostgreSQL with the following main tables:

- `users`: User accounts and profiles
- `rides`: Available rides
- `bookings`: Ride bookings
- `reviews`: User reviews
- `sessions`: User sessions

## Environment Variables

Required environment variables:

```env
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...
JWT_SECRET=your-jwt-secret
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables in `.env.local`

3. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## API Client Usage

The application includes a TypeScript API client (`app/lib/api.ts`) for easy integration:

```typescript
import { apiClient } from '@/app/lib/api'

// Set authentication token
apiClient.setToken('your-jwt-token')

// Get rides
const response = await apiClient.getRides({
  origin: 'Downtown',
  destination: 'Airport'
})

// Create a booking
const booking = await apiClient.createBooking({
  ride_id: 'uuid',
  seats_booked: 2
})
``` 