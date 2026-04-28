# TechNotes

## Project Overview

`TechNotes` is a small web application repository with a Node.js backend and a frontend folder. The backend is structured around Express.js and provides static file serving, a root route, and request handling with custom middleware.

## Repository Structure

- `backend/`
  - `package.json` - backend project metadata, dependencies, and scripts.
  - `server.js` - main Express server entry point.
  - `config/` - configuration helpers for CORS and allowed origins.
  - `logs/` - log storage directory.
  - `middleware/` - custom middleware functions.
    - `logger.js` - request logging support.
    - `errorHandler.js` - centralized error handling.
  - `public/` - static assets served to clients.
    - `css/styles.css` - stylesheet.
    - `a.txt` - example text asset.
  - `routes/` - Express router modules.
    - `root.js` - root route handler.
  - `views/` - HTML views for rendering responses.
    - `index.html` - main homepage.
    - `404.html` - fallback page for not-found routes.
- `frontend/` - frontend application code (not detailed here).

## Backend Details

### `backend/package.json`

The backend uses the following main dependencies:

- `express` - web server framework.
- `cors` - cross-origin resource sharing support.
- `cookie-parser` - cookie parsing middleware.
- `date-fns` - date formatting utilities.
- `uuid` - unique identifier generation.

Dev dependency:

- `nodemon` - restart server automatically during development.

Important scripts:

- `npm start` - runs the backend using `node server`.
- `npm run dev` - runs the backend with `nodemon server`.

### `backend/server.js`

This file is the app entry point. It does the following:

- Creates an Express application.
- Uses `express.json()` to parse JSON request bodies.
- Serves static files from `backend/public` at the application root.
- Mounts the root router from `backend/routes/root.js`.
- Adds a final 404 handler that returns HTML, JSON, or plain text based on the client's `Accept` header.
- Starts the server on `process.env.PORT` or port `3500`.

### `backend/routes/root.js`

This router handles the default website entry points:

- GET `/`
- GET `/index`
- GET `/index.html`

For these paths, it serves `backend/views/index.html`.

### `backend/middleware/logger.js`

This module is designed to support logging events. It currently:

- Imports `date-fns` to format timestamps.
- Imports `uuid` to generate unique IDs.
- Prepares a log message string with date/time, UUID, and custom message.

Note: the current `logger.js` file is incomplete; it builds a log entry but does not yet write it to a log file or export the logger function.

## How to Run the Backend

1. Open a terminal in `backend/`
2. Install dependencies:

```bash
npm install
```

3. Start the server:

```bash
npm start
```

4. For development with automatic restarts:

```bash
npm run dev
```

5. Open a browser at `http://localhost:3500` if the server starts successfully.

## Notes

- The backend currently serves its own static assets from `backend/public` and a homepage from `backend/views/index.html`.
- The `frontend/` folder exists but is not documented here because the attached backend files are the current focus.
- If you want to extend functionality, the next logical areas are:
  - completing `backend/middleware/logger.js`
  - verifying `backend/middleware/errorHandler.js`
  - adding additional route modules under `backend/routes/`
  - connecting a frontend implementation in `frontend/`
