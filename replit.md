# Replit.md

## Overview

This is a climbing social media app MVP built with a React frontend and Python FastAPI backend. The application features a mobile-first design for climbers to log and share their climbing sessions. The frontend uses TypeScript with shadcn/ui components, while the backend is built with FastAPI, SQLAlchemy, and PostgreSQL for robust data management.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Python 3.11 with FastAPI framework
- **Language**: Python with async/await support
- **Database ORM**: SQLAlchemy with PostgreSQL dialect
- **Database Provider**: PostgreSQL via psycopg2-binary
- **API Documentation**: Automatic OpenAPI/Swagger docs via FastAPI
- **Development**: uvicorn ASGI server with hot reload

### Database Design
- **Primary Database**: PostgreSQL 16
- **ORM**: SQLAlchemy for type-safe database operations
- **Schema Location**: `backend/models.py` for SQLAlchemy models
- **API Models**: `backend/schemas.py` for Pydantic request/response models
- **Current Schema**: 
  - Users table: id, username, password, profile_picture, created_at
  - Gyms table: id, name, location, created_at
  - Sessions table: id, user_id, gym_id, title, description, total_send, routes_climbed, duration_minutes, created_at

## Key Components

### Shared Layer (`shared/`)
- **Schema Definition**: Centralized database schema with Zod validation
- **Type Safety**: Shared TypeScript types between frontend and backend
- **Validation**: Drizzle-Zod integration for runtime validation

### Frontend (`client/`)
- **Component Library**: Comprehensive shadcn/ui component collection
- **Pages**: Modular page components with routing
- **Hooks**: Custom React hooks including mobile detection and toast notifications
- **Utils**: Utility functions for styling and common operations
- **Assets**: SVG icons and design assets

### Backend (`backend/`)
- **FastAPI Server**: Main application server with automatic API documentation
- **SQLAlchemy Models**: Database models with relationships for users, gyms, and sessions
- **Pydantic Schemas**: Request/response validation and serialization
- **CRUD Operations**: Database operations with proper error handling
- **Sample Data**: Seeded database with realistic climbing session data

## Data Flow

1. **Request Flow**: Client requests → FastAPI middleware → Route handlers → CRUD layer → SQLAlchemy → Database
2. **Response Flow**: Database → SQLAlchemy → CRUD layer → Pydantic models → JSON response → Client
3. **Development Flow**: Vite dev server proxies API requests to FastAPI backend
4. **Build Flow**: Vite builds frontend static assets, Python backend runs with uvicorn

## External Dependencies

### Core Runtime
- **Database**: Neon PostgreSQL serverless database
- **Session Store**: PostgreSQL-backed session storage capability
- **Development**: Replit environment with hot reload support

### UI Components
- **Radix UI**: Unstyled, accessible UI primitives
- **Lucide React**: Icon library for consistent iconography
- **Embla Carousel**: Carousel/slider functionality
- **Class Variance Authority**: Component variant management

### Development Tools
- **TypeScript**: Type safety across the entire stack
- **ESLint/Prettier**: Code formatting and linting (implied by setup)
- **PostCSS**: CSS processing with Tailwind and Autoprefixer

## Deployment Strategy

### Replit Configuration
- **Modules**: nodejs-20, web, postgresql-16, python-3.11
- **Development**: `npm run dev` starts FastAPI backend and Vite frontend concurrently
- **Build Process**: `npm run build` creates production frontend assets
- **Production**: `npm run start` serves FastAPI backend on port 5000
- **Port Configuration**: Internal port 5000, external port 80
- **Autoscale Deployment**: Configured for automatic scaling

### Environment Setup
- **Database URL**: Required environment variable for PostgreSQL connection
- **Development Mode**: Automatic Vite dev server with HMR
- **Production Mode**: Serves static files with Express

### Build Process
1. **Frontend Build**: Vite builds React app to `client/dist`
2. **Backend**: Python FastAPI server runs directly without bundling
3. **Asset Serving**: FastAPI can serve frontend assets statically in production
4. **Database Seeding**: `npm run seed` populates database with sample climbing data

## Changelog

- June 22, 2025: Initial setup with TypeScript/Express backend
- June 22, 2025: Converted backend from TypeScript/Express to Python/FastAPI
  - Created SQLAlchemy models for users, gyms, and climbing sessions
  - Implemented FastAPI endpoints with automatic API documentation
  - Added Pydantic schemas for request/response validation
  - Seeded database with sample climbing data
  - Updated frontend to work with Python API response format

## User Preferences

Preferred communication style: Simple, everyday language.