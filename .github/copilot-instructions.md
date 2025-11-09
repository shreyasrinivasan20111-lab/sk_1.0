<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is a full-stack course management application built with React + TypeScript frontend and Node.js + Express + SQLite backend. The app manages spiritual learning classes with role-based access control.

## Code Style & Conventions
- Use TypeScript for type safety
- Follow React functional component patterns with hooks
- Use async/await for API calls
- Implement proper error handling
- Use CSS modules or styled components for styling
- Follow RESTful API conventions

## Key Features to Remember
- Role-based access (admin vs student)
- File upload functionality for learning materials
- Practice timer with session tracking
- Class assignment system
- Authentication with JWT tokens

## Architecture Notes
- Frontend: React 18 + TypeScript + React Router + Axios
- Backend: Node.js + Express + TypeScript + SQLite
- Authentication: JWT tokens with bcrypt password hashing
- File Storage: Local file system with Multer
- Database: SQLite with manual schema setup

## Security Considerations
- Always validate user permissions before data access
- Sanitize file uploads and validate file types
- Use proper authentication middleware
- Hash passwords before storage
- Validate all API inputs
