# Notes Sharing App - Backend

## Setup Instructions

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the backend directory with the following variables:

```
PORT=3000
MONGO_URI=mongodb://localhost:27017/notes-app
JWT_SECRET=your-super-secret-jwt-key-here
ADMIN_SECRET=your-admin-secret-key-here
```

3. Make sure MongoDB is running on your system

4. Start the server:

```bash
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/create-admin` - Create admin user (requires admin secret)
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `GET /api/auth/users` - Get all users (Admin only)
- `POST /api/auth/share-by-email` - Share note by email

### Notes

- `POST /api/notes` - Create note
- `GET /api/notes` - Get all notes (filtered by user role)
- `GET /api/notes/:id` - Get single note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note
- `POST /api/notes/:id/share` - Share note with user ID
- `POST /api/notes/:id/unshare` - Unshare note with user ID

## Features

- JWT Authentication
- User roles (Admin/User)
- Note sharing functionality
- Access control based on user roles
- MongoDB integration
