# Environment Variables Setup

## Required Environment Variables

The frontend application uses the following environment variable:

- `VITE_API_URL` - The base URL for the backend API

## Setup Instructions

### For Production

Create a `.env.production` file in the `admin-dashboard` directory:

```env
VITE_API_URL=https://api.skykeenentreprise.com
```

**Alternative:** If using Render backend:
```env
VITE_API_URL=https://skykeen-backend.onrender.com
```

### For Development

Create a `.env.development` file (or `.env` file) in the `admin-dashboard` directory:

```env
VITE_API_URL=http://localhost:8000
```

## Default Behavior

If no environment variable is set, the application defaults to:
- `https://api.skykeenentreprise.com`

## Building for Production

When you run `npm run build`, Vite will automatically use `.env.production` if it exists.

When you run `npm run dev`, Vite will use `.env.development` or `.env` if they exist.

## Important Notes

- Environment files (`.env`, `.env.production`, `.env.development`) are gitignored and should not be committed
- The `VITE_` prefix is required for Vite to expose the variable to the frontend code
- After changing environment variables, restart the dev server or rebuild the application

