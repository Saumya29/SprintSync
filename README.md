# SprintSync

A lean task management tool with AI assistance for engineering teams.

## Overview

SprintSync is an internal tool designed for fast-moving AI consultancies to help engineers:

- Log work and track time on tasks
- Manage task status transitions (To Do → In Progress → Done)
- Get AI-powered assistance for task planning
- Track project progress efficiently
- Collaborate on sprints with team members

## Tech Stack

### Backend

- **Runtime**: Node.js with Express.js - Fast development, rich ecosystem for rapid MVP iteration
- **Database**: PostgreSQL with Prisma ORM - Type-safe database queries, automatic migrations, excellent developer experience
- **Authentication**: JWT-based authentication - Stateless, scalable solution for API security
- **AI Integration**: Google Generative AI (Gemini) - Cost-effective AI assistance for task planning
- **Testing**: Jest - Industry standard with great async support
- **API Documentation**: Auto-generated RESTful API docs - Reduces documentation overhead

### Frontend

- **Framework**: React - Component-based architecture, extensive ecosystem
- **Styling**: Tailwind CSS - Rapid UI development with utility-first approach
- **UI Components**: shadcn/ui with Radix UI - Copy-paste components with full customization control
- **State Management**: Local state with React hooks - Simple, straightforward for current MVP scope
- **Build Tool**: Create React App - Zero-config setup for quick prototyping
- **HTTP Client**: Native Fetch API - No external dependencies, modern browser support
- **Routing**: React Router - De facto standard for React SPAs

### Deployment

- **Frontend**: Vercel - Seamless React deployment with automatic CI/CD
- **Backend**: Render - Managed Node.js hosting with auto-scaling
- **Database**: Render PostgreSQL - Managed database with automated backups
- **Containerization**: Docker - Consistent development and deployment environments
- **Environment Management**: dotenv - Secure configuration management

## License

Private - Internal use only
