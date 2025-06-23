#!/bin/bash
# Build script for Vercel deployment

echo "Starting build process from root directory"
echo "Current directory: $(pwd)"

# Navigate to client directory
cd client || { echo "Failed to navigate to client directory"; exit 1; }
echo "Entered client directory: $(pwd)"

# Install dependencies
echo "Installing dependencies..."
npm install || { echo "Failed to install dependencies"; exit 1; }
npm install --save-dev tailwindcss postcss autoprefixer @types/node || { echo "Failed to install dev dependencies"; exit 1; }

# Run build
echo "Running build..."
npm run build || { echo "Build failed"; exit 1; }

echo "Build completed successfully"
exit 0
