# RideShare - Deployment Guide

## Vercel Deployment

This project is configured for seamless deployment on Vercel with Prisma and Supabase integration.

### Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Supabase Project**: Set up your Supabase project
3. **Environment Variables**: Prepare your environment variables

### Environment Variables

Set these environment variables in your Vercel project settings:

```bash
# Database Configuration
DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres?pgbouncer=true&connection_limit=1
DIRECT_URL=postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT_ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR_SUPABASE_ANON_KEY]
SUPABASE_SERVICE_ROLE_KEY=[YOUR_SUPABASE_SERVICE_ROLE_KEY]

# NextAuth Configuration
NEXTAUTH_URL=https://[YOUR_DOMAIN].vercel.app
NEXTAUTH_SECRET=[YOUR_NEXTAUTH_SECRET]

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=[YOUR_GOOGLE_CLIENT_ID]
GOOGLE_CLIENT_SECRET=[YOUR_GOOGLE_CLIENT_SECRET]
```

### Deployment Steps

1. **Connect Repository**:
   - Import your GitHub repository to Vercel
   - Vercel will automatically detect Next.js

2. **Configure Build Settings**:
   - Build Command: `prisma generate && next build`
   - Install Command: `npm install && prisma generate`
   - Output Directory: `.next` (default)

3. **Set Environment Variables**:
   - Go to Project Settings → Environment Variables
   - Add all the variables listed above

4. **Deploy**:
   - Click "Deploy" and wait for the build to complete
   - Your app will be available at `https://[PROJECT_NAME].vercel.app`

### Build Process

The project is configured with:

- **Pre-build**: Prisma Client generation
- **Build**: Next.js production build
- **Post-install**: Prisma Client generation (fallback)

### Troubleshooting

#### Prisma Client Error
If you see "Prisma Client is not generated", ensure:
- Environment variables are set correctly
- Build command includes `prisma generate`
- `vercel.json` is properly configured

#### Database Connection Issues
- Verify `DATABASE_URL` and `DIRECT_URL` are correct
- Check Supabase project status
- Ensure database is accessible from Vercel

#### Authentication Issues
- Verify Supabase URL and keys
- Check Google OAuth configuration
- Ensure redirect URLs are set correctly

### Local Development

```bash
# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Push database schema
npx prisma db push

# Start development server
npm run dev
```

### Production Database Setup

1. **Create Supabase Project**
2. **Run Database Migrations**:
   ```bash
   npx prisma db push
   ```
3. **Seed Database** (optional):
   ```bash
   npm run seed
   ```

### Support

For issues with deployment:
1. Check Vercel build logs
2. Verify environment variables
3. Test database connectivity
4. Review Prisma Client generation

---

**Note**: This project uses Prisma with PostgreSQL (Supabase) and is optimized for Vercel's serverless environment.
