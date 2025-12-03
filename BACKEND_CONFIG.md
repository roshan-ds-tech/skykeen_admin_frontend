# Backend Configuration Requirements

## API Endpoint

The frontend applications are configured to send requests to:
- **API URL:** `https://api.skykeenentreprise.com`

## CORS Configuration

The backend API must be configured to allow requests from the following frontend origins:

```env
CORS_ALLOWED_ORIGINS=https://skykeenentreprise.com,https://www.skykeenentreprise.com,https://admin.skykeenentreprise.com
```

### Frontend URLs

These are the production frontend URLs that will call the backend API:

1. `https://skykeenentreprise.com`
2. `https://www.skykeenentreprise.com`
3. `https://admin.skykeenentreprise.com`

### Implementation Notes

- This configuration should be set in your backend environment variables (`.env` file or deployment configuration)
- Ensure that the backend CORS middleware is properly configured to read and apply these allowed origins
- The frontend uses `withCredentials: true` for session-based authentication, so ensure CORS credentials are enabled on the backend

