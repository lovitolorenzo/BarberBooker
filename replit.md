# Duo Lab Booking System

## Overview

This is a full-stack web application for a barbershop appointment booking system. The application allows customers to book appointments by selecting dates, times, and services through an intuitive calendar interface. It features a modern dark theme with gold accents that reflects a premium barbershop aesthetic.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a modern full-stack TypeScript architecture with the following key design decisions:

### Frontend Architecture
- **React with TypeScript**: Chosen for type safety and component-based development
- **Vite**: Used as the build tool for fast development and optimized production builds
- **TailwindCSS + shadcn/ui**: Provides a consistent design system with pre-built accessible components
- **TanStack Query**: Handles server state management, caching, and API calls
- **React Hook Form + Zod**: Form handling with robust validation
- **Wouter**: Lightweight client-side routing

### Backend Architecture
- **Express.js**: RESTful API server with TypeScript support
- **Node.js**: Runtime environment with ES modules
- **In-memory storage**: Currently uses a Map-based storage system for development
- **Drizzle ORM**: Database toolkit with PostgreSQL support (configured but not yet implemented)

### Data Storage Strategy
The application is designed with a dual storage approach:
- **Development**: In-memory storage with pre-seeded mock data for quick development
- **Production Ready**: Drizzle ORM configured for PostgreSQL with migration support

## Key Components

### Database Schema
- **Appointments Table**: Stores customer information, service details, scheduling data, and status
- **Services Configuration**: Predefined service types (haircut, beard trim, full service) with duration and pricing
- **Type Safety**: Zod schemas ensure data validation at runtime

### API Endpoints
- `GET /api/appointments/date/:date` - Fetch appointments for a specific date
- `GET /api/appointments/range` - Fetch appointments within a date range  
- `POST /api/appointments` - Create new appointment with conflict checking

### Frontend Components
- **Calendar Component**: Interactive date selection with appointment availability display
- **Booking Form**: Multi-step form for customer details and service selection
- **Confirmation Modal**: Success feedback with booking details
- **Toast Notifications**: User feedback for actions and errors

## Data Flow

1. **Calendar Display**: User selects a date, triggering API call to fetch existing appointments
2. **Time Selection**: Available time slots calculated based on existing bookings and service durations
3. **Service Selection**: User chooses from predefined services with automatic price calculation
4. **Form Submission**: Customer details validated and submitted with conflict checking
5. **Confirmation**: Success response triggers confirmation modal display

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Database driver for serverless PostgreSQL
- **@radix-ui/**: Accessible headless UI primitives
- **@tanstack/react-query**: Server state management
- **drizzle-orm & drizzle-kit**: Database ORM and migration tools
- **zod**: Runtime type validation

### Development Tools
- **tsx**: TypeScript execution for development
- **esbuild**: Fast JavaScript bundler for production builds
- **vite**: Development server and build tool

## Deployment Strategy

### Development Environment
- **Replit Integration**: Configured for seamless development in Replit
- **Hot Module Replacement**: Vite provides instant feedback during development
- **Development Database**: In-memory storage for quick iteration

### Production Deployment
- **Build Process**: Vite builds client-side assets, esbuild bundles server code
- **Database Migration**: Drizzle migrations ready for PostgreSQL deployment
- **Environment Variables**: DATABASE_URL required for production database connection
- **Autoscale Deployment**: Configured for Replit's autoscale deployment target

The architecture emphasizes developer experience with hot reloading, type safety, and easy deployment while maintaining production readiness with proper database integration and build optimization.