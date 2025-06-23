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

# Run build using build:vercel script to skip TypeScript checks
echo "Running build using build:vercel script..."
npm run build:vercel || { echo "Build failed"; exit 1; }

# Move back to root and copy files to root dist directory
echo "Setting up output directory structure"
cd .. || { echo "Failed to navigate back to root"; exit 1; }

# Create dist directory at root if it doesn't exist
mkdir -p dist

# Copy all files from client/dist to root dist
cp -r client/dist/* dist/ || { echo "Failed to copy build files"; exit 1; }

echo "Build completed successfully - files copied to root dist directory"
exit 0
