# Course Management App

A comprehensive course management system similar to Google Classroom, designed for spiritual learning with classes like Kirtanam, Smaranam, Pada Sevanam, Archanam, and Vandanam.

## Features

### Student Features
- **User Authentication**: Secure login and registration system
- **Class Access**: View assigned classes with learning materials
- **Learning Materials**: Access to lyrics and audio/video recordings
- **Practice Timer**: Built-in timer to track practice sessions with notes
- **Session History**: View past practice sessions and progress

### Admin Features
- **Student Management**: Assign students to specific classes
- **Material Upload**: Upload lyrics (text/files) and recordings (audio/video)
- **Practice Monitoring**: View all student practice sessions
- **Statistics Dashboard**: Overview of student engagement and practice time
- **Role-based Access**: Automatic admin role for specified email addresses

### System Features
- **Centralized Database**: SQLite database stores all user data and materials
- **File Storage**: Secure file upload and storage for materials
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Updates**: Live data synchronization across sessions

## Tech Stack

### Backend
- **Node.js** with **Express.js** - Server framework
- **TypeScript** - Type-safe development
- **SQLite** - Lightweight database for data storage
- **JWT** - Authentication tokens
- **Multer** - File upload handling
- **bcryptjs** - Password hashing

### Frontend
- **React 18** with **TypeScript** - Modern UI framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Lucide React** - Beautiful icons
- **CSS3** - Custom styling with gradients and animations

## Project Structure

```
course-management-app/
├── backend/
│   ├── src/
│   │   ├── database/
│   │   │   └── init.ts          # Database initialization
│   │   ├── routes/
│   │   │   ├── auth.ts          # Authentication endpoints
│   │   │   ├── classes.ts       # Class management endpoints
│   │   │   ├── admin.ts         # Admin-only endpoints
│   │   │   └── upload.ts        # File upload endpoints
│   │   └── server.ts            # Main server file
│   ├── uploads/                 # File storage directory
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx       # Navigation component
│   │   │   └── ProtectedRoute.tsx # Route protection
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx  # Authentication context
│   │   ├── pages/
│   │   │   ├── Home.tsx         # Landing page
│   │   │   ├── Login.tsx        # Login page
│   │   │   ├── Register.tsx     # Registration page
│   │   │   ├── Dashboard.tsx    # Student dashboard
│   │   │   ├── ClassPage.tsx    # Individual class page
│   │   │   └── AdminPanel.tsx   # Admin management panel
│   │   └── App.tsx              # Main app component
│   └── package.json
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The backend will run on `http://localhost:3001`

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

## Usage

### Admin Access
Admin accounts are automatically created for these email addresses:
- `shreya.srinivasan2011@gmail.com`
- `jayab2021@gmail.com`

### Student Access
Any other email address will create a student account. Students must be assigned to classes by an admin before they can access any materials.

### Getting Started
1. Visit the application at `http://localhost:5173`
2. Register a new account or login with existing credentials
3. **Admin users** can:
   - Access the Admin Panel to manage students
   - Assign students to classes
   - Upload learning materials (lyrics and recordings)
   - View practice statistics
4. **Student users** can:
   - View their assigned classes
   - Access learning materials
   - Use the practice timer
   - Track their progress

## Database Schema

The application uses SQLite with the following main tables:
- **users** - User accounts and roles
- **classes** - Available classes (Kirtanam, Smaranam, etc.)
- **user_classes** - Student-to-class assignments
- **materials** - Learning materials (lyrics and recordings)
- **practice_sessions** - Timer session records

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- File upload validation
- Protected API endpoints
- Input sanitization

## Contributing

This project is designed to be maintainable even by beginners:
- Clear file organization
- Comprehensive comments
- TypeScript for type safety
- Modular component structure
- RESTful API design

## License

MIT License - feel free to use this project for educational purposes.

## Support

For issues or questions, please refer to the code comments or create an issue in the repository.
