#!/bin/bash

# Multi-platform deployment script for RideShare
# Usage: ./deploy.sh [platform]
# Platforms: vercel, docker, heroku, railway

PLATFORM=${1:-vercel}

echo "🚀 Deploying RideShare to $PLATFORM..."

case $PLATFORM in
  "vercel")
    echo "📦 Deploying to Vercel..."
    npx vercel --prod
    ;;
  
  "docker")
    echo "🐳 Building Docker image..."
    docker build -t rideshare .
    echo "✅ Docker image built successfully!"
    echo "Run with: docker run -p 3000:3000 rideshare"
    ;;
  
  "heroku")
    echo "🟣 Deploying to Heroku..."
    git push heroku main
    ;;
  
  "railway")
    echo "🚂 Deploying to Railway..."
    npx @railway/cli@latest deploy
    ;;
  
  "gcloud")
    echo "☁️ Deploying to Google Cloud Run..."
    gcloud run deploy rideshare --source . --platform managed --region us-central1
    ;;
  
  *)
    echo "❌ Unknown platform: $PLATFORM"
    echo "Available platforms: vercel, docker, heroku, railway, gcloud"
    exit 1
    ;;
esac

echo "✅ Deployment to $PLATFORM completed!"
