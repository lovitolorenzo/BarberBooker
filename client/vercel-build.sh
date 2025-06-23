#!/bin/bash
# Install development dependencies
npm install
npm install --save-dev @types/node tailwindcss postcss autoprefixer

# Run build using build:vercel script to skip TypeScript checks
npm run build:vercel
