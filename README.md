# TechNotes

## Project Overview

`TechNotes` is a Node.js + Express backend for a note-taking application with MongoDB persistence. The backend includes user and note management APIs, CORS support, request/error logging, static asset serving, and password hashing for user creation and updates.

## Repository Structure

- `backend/`
  - `.env` - environment variables, including `DATABASE_URI` for MongoDB.
  - `package.json` - backend dependencies and scripts.
  - `server.js` - main Express server entry point.
  - `config/` - configuration helpers.
    - `allowedOrigns.js` - allowed CORS origins.
    - `corsOptions.js` - CORS policy configuration.
    - `dbConn.js` - MongoDB connection helper.
  - `controllers/` - request handlers for routes.
    - `notesController.js` - CRUD operations for notes.
    - `usersControllers.js` - CRUD operations for users.
  - `middleware/` - reusable middleware.
    - `logger.js` - request logging and log file writing.
    - `errorHandler.js` - centralized error handling and logging.
  - `models/` - Mongoose data models.
    - `Note.js` - note schema with user reference, title/text, completed status, and auto-increment ticket field.
    - `User.js` - user schema with hashed password, roles, and active status.
  - `public/` - static files served to clients.
    - `css/styles.css` - stylesheet.
    - `a.txt` - example static asset.
  - `routes/` - Express route modules.
    - `root.js` - homepage route.
    - `userRoutes.js` - user API routes.
    - `noteRoutes.js` - note API routes.
  - `views/` - HTML view templates.
    - `index.html` - main homepage.
    - `404.html` - not-found fallback page.
- `frontend/` - frontend application code (not documented here).

## Backend Details

### Dependencies

The backend uses the following main dependencies:

- `express` - web server framework.
- `bcrypt` - password hashing.
- `cookie-parser` - cookie parsing middleware.
- `cors` - cross-origin resource sharing support.
- `date-fns` - date formatting utilities.
- `dotenv` - environment variable loading.
- `express-async-handler` - async route wrapper.
- `mongoose` - MongoDB object modeling.
- `mongoose-sequence` - auto-increment plugin.
- `uuid` - unique identifier generation.

Dev dependency:

- `nodemon` - restart server automatically during development.

### Scripts

- `npm start` - runs the backend using `node server`.
- `npm run dev` - runs the backend with `nodemon server`.

### `backend/server.js`

The backend entry point:

- loads environment variables from `.env`.
- connects to MongoDB using `backend/config/dbConn.js`.
- uses custom request logging middleware from `backend/middleware/logger.js`.
- applies CORS using `backend/config/corsOptions.js`.
- parses JSON request bodies and cookies.
- serves static files from `backend/public`.
- mounts route modules for `/`, `/users`, and `/notes`.
- returns a 404 response in HTML, JSON, or plain text when no route matches.
- starts the server after the MongoDB connection is successfully opened.

### API Routes

- `GET /`, `/index`, `/index.html` - serves `backend/views/index.html`.
- `GET /users` - list all users (passwords omitted).
- `POST /users` - create a new user with hashed password.
- `PATCH /users` - update an existing user's username, roles, active status, and optional password.
- `DELETE /users` - delete a user if no notes are assigned.
- `GET /notes` - list all notes with populated user username.
- `POST /notes` - create a note for an existing user.
- `PATCH /notes` - update a note's text, title, completed status, and user.
- `DELETE /notes` - delete a note by ID.

### Data Models

- `User` model stores `username`, hashed `password`, `roles`, and `active`.
- `Note` model stores a `user` reference, `title`, `text`, `completed`, timestamps, and an auto-increment `ticket` field.
- Note titles are enforced unique per user.

### Logging and Error Handling

- `backend/middleware/logger.js` writes requests to `backend/logs/reqLog.log` and prints request info to the console.
- `backend/middleware/errorHandler.js` logs errors to `backend/logs/errLog.log` and returns JSON error responses.

## Running the Backend

1. Open a terminal in `backend/`.
2. Install dependencies:

```bash
npm install
```

3. Create or update `.env` with your MongoDB connection string:

```env
DATABASE_URI=<your MongoDB URI>
```

4. Start the server:

```bash
npm start
```

5. For development with automatic restarts:

```bash
npm run dev
```

6. Open a browser at `http://localhost:3500` once the server is running.

## Notes

- The backend connects to MongoDB via `DATABASE_URI` from `.env`.
- The `users` and `notes` routes are designed for API usage and expect JSON bodies.
- Static assets are served from `backend/public`, while the homepage is served from `backend/views/index.html`.
- The `frontend/` folder exists but is not covered in this README.
