#!/bin/bash

# Deploy to Google Cloud Platform
echo "Deploying to Google Cloud Platform..."

# Set your project ID
PROJECT_ID="your-project-id"

# Set the region
REGION="us-central1"

# Build and deploy
echo "Building and deploying the application..."

# Deploy using gcloud app deploy
gcloud app deploy app.yaml --project=$PROJECT_ID --quiet

echo "Deployment completed!"
echo "Your app should be available at: https://$PROJECT_ID.appspot.com"