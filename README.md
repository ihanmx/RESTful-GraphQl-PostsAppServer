# Posts App — REST API Server

Express.js REST API backend for a posts application. Handles authentication, post CRUD, image uploads, and user status.

## Tech Stack

- **Node.js** with ES modules (`import/export`)
- **Express.js** v5
- **MongoDB** via Mongoose
- **JWT** for authentication
- **Multer** for image uploads
- **bcryptjs** for password hashing
- **express-validator** for input validation
- **cors** for cross-origin requests

## Project Structure

```
server/
├── app.js                  # Entry point, middleware setup
├── controllers/
│   ├── auth.js             # Signup, login
│   ├── feed.js             # Post CRUD
│   └── status.js           # User status get/update
├── middleware/
│   └── isAuth.js           # JWT verification middleware
├── models/
│   ├── post.js             # Post schema
│   └── user.js             # User schema
├── routes/
│   ├── auth.js             # /auth routes
│   ├── feed.js             # /feed routes
│   └── status.js           # /status routes
├── config/
│   ├── allowedOrigins.js   # CORS whitelist
│   └── corsOptions.js      # CORS config
└── images/                 # Uploaded images (static)
```

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file:
   ```
   MONGO_URI=your_mongodb_connection_string
   ```

3. Start the server:
   ```bash
   npm start
   ```

Server runs on `http://localhost:5000`.

## API Endpoints

### Auth — `/auth`

| Method | Path      | Auth | Description       |
|--------|-----------|------|-------------------|
| POST   | /signup   | No   | Register new user |
| POST   | /login    | No   | Login, returns JWT token |

**Signup body:**
```json
{ "email": "user@example.com", "password": "12345", "name": "John" }
```

**Login response:**
```json
{ "token": "<jwt>", "userId": "<id>" }
```

### Posts — `/feed`

All routes require `Authorization: Bearer <token>` header.

| Method | Path            | Description                        |
|--------|-----------------|------------------------------------|
| GET    | /posts          | Get paginated posts (`?page=1`)    |
| POST   | /post           | Create a post (multipart/form-data)|
| GET    | /post/:postId   | Get a single post                  |
| PUT    | /post/:postId   | Update a post (multipart/form-data)|
| DELETE | /post/:postId   | Delete a post                      |

**Create/Update post fields** (form-data):
- `title` — min 5 characters
- `content` — min 5 characters
- `image` — image file (png, jpg, jpeg)

Only the post creator can update or delete their own posts.

### Status — `/status`

Requires `Authorization: Bearer <token>` header.

| Method | Path | Description            |
|--------|------|------------------------|
| GET    | /    | Get current user status|
| PUT    | /    | Update user status     |

**Update status body:**
```json
{ "status": "Feeling great!" }
```

## Images

Uploaded images are saved to `server/images/` and served statically at `http://localhost:5000/images/<filename>`.

## Authentication

JWT tokens expire after **1 hour**. Include the token in every protected request:

```
Authorization: Bearer <token>
```

The `isAuth` middleware verifies the token and attaches `req.userId` for use in controllers.
