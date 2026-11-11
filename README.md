# Social Media Website - Instagram Clone

A full-stack social media app inspired by Instagram. Users can create accounts, share posts, follow other users, and communicate through real-time messaging.

## Features

- Sign up, log in, log out, and protected routes
- User profiles with editable profile information
- Create posts with image uploads
- Like, comment on, and bookmark posts
- Follow and unfollow users
- Suggested users
- Real-time chat and notifications

## Tech stack

- **Frontend:** React, Vite, Redux Toolkit, React Router, Tailwind CSS
- **Backend:** Node.js, Express, Socket.IO
- **Database:** MongoDB with Mongoose
- **Image storage:** Cloudinary
- **Authentication:** JWT in an HTTP-only cookie

## Requirements

- Node.js and npm
- A MongoDB database
- A Cloudinary account for image uploads

## Setup

Install the backend dependencies from the repository root and the frontend dependencies:

```bash
npm install
npm install --prefix frontend
```

Create a `.env` file in the repository root:

```env
MONGO_URI=your_mongodb_connection_string
SECRET_KEY=your_long_random_secret
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
URL=http://localhost:5173
PORT=3000
```

Keep real credentials private; do not commit them to the repository.

## Run locally

Start the backend from the repository root:

```bash
npm run dev
```

In a second terminal, start the Vite frontend:

```bash
npm run dev --prefix frontend
```

Open the frontend at [http://localhost:5173](http://localhost:5173). The backend listens on port `3000` by default.

> **Local API configuration:** The frontend currently points its API and Socket.IO requests to the deployed Render service. To use your local backend, change those request/socket base URLs in `frontend/src` to `http://localhost:3000`.

## Build and deploy

The root build script installs the dependencies and builds the frontend:

```bash
npm run build
```

The backend serves the generated `frontend/dist` files. For a single-service deployment such as Render, use:

- **Build command:** `npm run build`
- **Start command:** `npm start`

Configure the environment variables above in the hosting provider. Set `URL` to the frontend origin allowed to make credentialed API and Socket.IO requests. The server uses the hosting provider's `PORT` when available.

The deployed app is available at [social-media-website-instagram-clone.onrender.com](https://social-media-website-instagram-clone.onrender.com/).

## Useful commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the backend with nodemon |
| `npm start` | Start the backend |
| `npm run build` | Build the frontend for deployment |
| `npm run dev --prefix frontend` | Start the Vite frontend |
| `npm run build --prefix frontend` | Build only the frontend |
| `npm run lint --prefix frontend` | Lint the frontend |
