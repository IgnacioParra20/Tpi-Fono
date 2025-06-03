# Fono App Server

This is the backend server for the Fono App, handling authentication and progress tracking.

## Current Progress
- ✅ Basic Express server setup
- ✅ MongoDB connection configuration
- ✅ Basic API endpoint testing
- ⬜ Database schema implementation
- ⬜ Authentication endpoints
- ⬜ Progress tracking endpoints

## Prerequisites
- Node.js
- MongoDB Community Server 7.0.20
- npm (Node Package Manager)

## Directory Structure

```
server/
├── config/         # Configuration files
├── controllers/    # Route controllers
├── middleware/     # Custom middleware
├── models/         # Database models
├── routes/         # API routes
├── .env           # Environment variables
├── server.js      # Main server file
└── package.json   # Dependencies and scripts
```

## Setup Instructions

1. Install MongoDB Community Server 7.0.20:
   - Download from MongoDB website
   - Run the installer
   - Ensure MongoDB is running as a Windows service

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a .env file with the following variables:
   ```
   MONGODB_URI=mongodb://localhost:27017/fono-app
   JWT_SECRET=your_jwt_secret_key_here
   PORT=5000
   ```

4. Start the server:
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

## Testing the Setup

1. Verify MongoDB is running:
   - Open Services (Win + R, type `services.msc`)
   - Look for "MongoDB" service
   - Status should be "Running"

2. Start the server:
   ```bash
   npm run dev
   ```

3. Test the API:
   - Open browser and navigate to `http://localhost:5000`
   - You should see: `{"message": "Welcome to the Fono App API"}`

## API Endpoints

Currently implemented:
- `GET /`: Welcome message

Planned endpoints:
- Authentication endpoints (register, login)
- Progress tracking endpoints
- User management endpoints

## Dependencies
- express: ^4.18.2
- mongoose: ^7.0.3
- cors: ^2.8.5
- dotenv: ^16.5.0
- bcryptjs: ^3.0.2
- jsonwebtoken: ^9.0.2
- nodemon: ^3.1.7 (dev dependency)