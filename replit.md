# Replit.md

## Overview

This is a full-stack climbing session tracking social media application built with a React frontend and Express.js backend. The application features JWT authentication, user registration/login, session management, and a social feed for sharing climbing achievements. It uses TypeScript throughout and is designed for deployment on Replit with PostgreSQL database support. The frontend utilizes shadcn/ui components for a modern user interface, while the backend provides a comprehensive RESTful API architecture with authentication middleware.

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
- **Runtime**: Node.js 20 with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **Session Management**: Ready for PostgreSQL-backed sessions (connect-pg-simple)
- **Development**: tsx for TypeScript execution in development

### Database Design
- **Primary Database**: PostgreSQL 16
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Location**: `shared/schema.ts` for shared types between client/server
- **Migrations**: Applied via `npm run db:push`
- **Current Schema**: 
  - Users table: id, username, email, hashedPassword, avatarUrl, createdAt, updatedAt
  - Sessions table: id, userId, location, title, totalSends, routesClimbed, durationMinutes, createdAt
  - Media table: id, sessionId, url, type, thumbnailUrl, duration, orderIndex, createdAt
- **Authentication**: JWT-based with bcrypt password hashing
- **Media Support**: Photos and videos with horizontal scrollable galleries

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

### Backend (`server/`)
- **Express Server**: Main application server with CORS and authentication middleware
- **Authentication System**: JWT-based auth with bcrypt password hashing (`server/auth.ts`)
- **Storage Interface**: Abstracted storage layer supporting both PostgreSQL and in-memory implementations
- **Route Registration**: FastAPI-style comprehensive API endpoints with proper error handling
- **API Endpoints**:
  - User management: `/api/users/register`, `/api/users/login`, `/api/users/me`, `/api/users/:userId`
  - Session management: `/api/sessions` (CRUD operations with authentication)
  - Media management: `/api/sessions/:sessionId/media` (add photos/videos to sessions)
  - Social feed: `/api/feed` (paginated climbing sessions with media)
  - Legacy compatibility: `/api/timeline` (backwards compatibility)

## Data Flow

1. **Request Flow**: Client requests → Express middleware → Route handlers → Storage layer → Database
2. **Response Flow**: Database → Storage layer → Route handlers → JSON response → Client
3. **Development Flow**: Vite dev server proxies API requests to Express backend
4. **Build Flow**: Vite builds frontend static assets, esbuild bundles backend

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

## Recent Changes

✓ Added media photos/videos feature to climbing session cards (June 24, 2025)
✓ Created media table with photo/video support and horizontal scrollable gallery  
✓ Enhanced feed endpoint to include media with proper thumbnails and video duration
✓ Implemented MediaGallery component with video duration overlays
✓ Updated SessionCard component to display media seamlessly
✓ Added media upload endpoint for authenticated users
✓ Retuned backend with FastAPI-style architecture (June 24, 2025)
✓ Added JWT authentication system with user registration/login
✓ Implemented comprehensive session CRUD operations  
✓ Enhanced database schema with proper user and session management
✓ Added paginated feed endpoint with social media features
✓ CORS middleware configuration for cross-origin requests

## Changelog

- June 24, 2025: Added media photos/videos feature with horizontal scrollable galleries, video duration overlays, and media upload endpoints
- June 24, 2025: Major backend overhaul - FastAPI-style API endpoints, JWT authentication, enhanced database schema
- June 22, 2025: Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.