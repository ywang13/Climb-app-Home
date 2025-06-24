# Replit.md

## Overview

This is a full-stack web application built with a React frontend and Express.js backend. The application uses TypeScript throughout and is designed for deployment on Replit with PostgreSQL database support. The frontend utilizes shadcn/ui components for a modern user interface, while the backend provides a RESTful API architecture.

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
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Location**: `shared/schema.ts` for shared types between client/server
- **Migrations**: Stored in `./migrations` directory
- **Current Schema**: Users table with id, username, and password fields

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

1. **Request Flow**: Client requests → FastAPI middleware → Route handlers → CRUD operations → Database
2. **Response Flow**: Database → SQLAlchemy models → Pydantic schemas → JSON response → Client
3. **Development Flow**: Vite dev server proxies API requests to FastAPI backend
4. **Build Flow**: Vite builds frontend static assets, Python backend runs directly

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
- **Modules**: nodejs-20, web, postgresql-16
- **Development**: `npm run dev` starts both frontend and backend
- **Build Process**: `npm run build` creates production assets
- **Production**: `npm run start` serves the built application
- **Port Configuration**: Internal port 5000, external port 80
- **Autoscale Deployment**: Configured for automatic scaling

### Environment Setup
- **Database URL**: Required environment variable for PostgreSQL connection
- **Development Mode**: Automatic Vite dev server with HMR
- **Production Mode**: Serves static files with Express

### Build Process
1. **Frontend Build**: Vite builds React app to `dist/public`
2. **Backend Build**: esbuild bundles Express server to `dist/index.js`
3. **Asset Serving**: Production server serves frontend assets statically
4. **Database Migration**: `npm run db:push` applies schema changes

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