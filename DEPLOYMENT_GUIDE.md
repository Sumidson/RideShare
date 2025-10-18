# RideShare - Multi-Platform Deployment Guide

## 🚀 Deployment Options

This project supports multiple deployment platforms. Choose the one that best fits your needs.

### 1. Vercel (Recommended)

**Best for**: Next.js applications, serverless functions, easy setup

```bash
# Deploy to Vercel
npx vercel --prod
```

**Environment Variables**:
- Set in Vercel dashboard under Project Settings → Environment Variables
- All variables from `.env.local` need to be added

### 2. Docker Deployment

**Best for**: Self-hosted, Kubernetes, any container platform

```bash
# Build Docker image
npm run docker:build

# Run locally
npm run docker:run

# Or manually
docker build -t rideshare .
docker run -p 3000:3000 rideshare
```

### 3. Google Cloud Run

**Best for**: Serverless containers, Google Cloud ecosystem

```bash
# Build and deploy to Cloud Run
gcloud run deploy rideshare --source . --platform managed --region us-central1
```

### 4. Heroku

**Best for**: Simple deployment, PostgreSQL add-ons

```bash
# Deploy to Heroku
git push heroku main
```

**Required Add-ons**:
- Heroku Postgres (for database)
- Or use Supabase (external database)

### 5. Railway

**Best for**: Full-stack applications, database included

```bash
# Deploy to Railway
npx @railway/cli@latest deploy
```

## 🔧 Platform-Specific Configurations

### Buildpack Issues (Google Cloud Build)

If you encounter "untrusted builder" errors:

1. **Use Dockerfile** (recommended):
   ```bash
   # The Dockerfile is already configured
   docker build -t rideshare .
   ```

2. **Or configure buildpack**:
   ```bash
   # Use the project.toml file
   pack build rideshare --builder gcr.io/buildpacks/nodejs
   ```

### Environment Variables by Platform

#### Vercel
```bash
DATABASE_URL=postgresql://...
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

#### Docker/Cloud Run
```bash
# Set in docker run command or Cloud Run environment
docker run -e DATABASE_URL="..." -e NEXT_PUBLIC_SUPABASE_URL="..." rideshare
```

#### Heroku
```bash
# Set via Heroku CLI
heroku config:set DATABASE_URL="postgresql://..."
heroku config:set NEXT_PUBLIC_SUPABASE_URL="https://..."
```

## 🛠️ Troubleshooting

### Common Build Errors

1. **"Untrusted builder" error**:
   - Use Dockerfile instead of buildpacks
   - Or configure trusted builder in project.toml

2. **Prisma Client not generated**:
   - Ensure `prisma generate` runs before `next build`
   - Check postinstall script in package.json

3. **Environment variables not loaded**:
   - Verify variables are set in platform dashboard
   - Check variable names match exactly

4. **Database connection issues**:
   - Verify DATABASE_URL format
   - Check if database allows external connections
   - Ensure SSL is configured if required

### Platform-Specific Issues

#### Google Cloud Build
- Use `gcloud builds submit` with Dockerfile
- Or configure buildpack with `project.toml`

#### Heroku
- Ensure `Procfile` is present
- Use `heroku-postbuild` script for Prisma generation

#### Docker
- Check `.dockerignore` excludes unnecessary files
- Verify multi-stage build optimization

## 📋 Pre-Deployment Checklist

- [ ] Environment variables configured
- [ ] Database accessible from deployment platform
- [ ] Prisma schema pushed to database
- [ ] Build process tested locally
- [ ] Domain/URL configured for OAuth (if using Google sign-in)

## 🔄 Continuous Deployment

### GitHub Actions (Vercel)
```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

### Docker Hub
```yaml
# .github/workflows/docker.yml
name: Build and Push Docker Image
on:
  push:
    branches: [main]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build and push
        uses: docker/build-push-action@v2
        with:
          push: true
          tags: your-username/rideshare:latest
```

---

**Need Help?** Check the specific platform documentation or create an issue in the repository.
