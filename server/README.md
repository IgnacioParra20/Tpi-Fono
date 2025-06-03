# Fono App Server

This is the backend server for the Fono App, handling authentication and progress tracking.

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

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a .env file with the following variables:
   ```
   MONGODB_URI=mongodb://localhost:27017/fono-app
   JWT_SECRET=your_jwt_secret_key_here
   PORT=5000
   ```

3. Start the server:
   ```bash
   npm start
   ```

## API Endpoints

- `GET /`: Welcome message
- More endpoints will be added as development progresses