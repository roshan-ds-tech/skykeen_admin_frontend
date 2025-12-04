# Deployment Guide

## Important: Server Configuration for React Router

This is a **Single Page Application (SPA)** built with React Router. For proper routing to work, your web server must be configured to serve `index.html` for all routes.

### Why This Is Needed

When a user navigates to `/dashboard` directly (or after login), the server will try to find a file at that path. Since this is a SPA, all routes are handled by React Router in the browser. The server needs to serve `index.html` for all routes so React Router can take over.

### Server Configuration Examples

#### Nginx Configuration

```nginx
server {
    listen 80;
    server_name admin.skykeenentreprise.com;

    root /path/to/admin-dashboard/dist;
    index index.html;

    # Serve static files
    location /assets {
        try_files $uri =404;
    }

    # Serve index.html for all routes (SPA routing)
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

#### Apache Configuration (.htaccess)

Place this `.htaccess` file in the `dist` directory:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

#### Vercel Configuration (vercel.json)

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

#### Netlify Configuration (netlify.toml)

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### Cloudflare Pages

Cloudflare Pages automatically handles SPA routing. No additional configuration needed.

### Building for Production

1. Build the production bundle:
   ```bash
   npm run build
   ```

2. The `dist` folder contains all the files you need to deploy.

3. Upload the contents of the `dist` folder to your web server.

### Testing

After deployment, test these URLs:
- `https://admin.skykeenentreprise.com/` - Should load the app
- `https://admin.skykeenentreprise.com/login` - Should load the login page
- `https://admin.skykeenentreprise.com/dashboard` - Should load the dashboard (after login)

All of these should serve `index.html` and React Router will handle the routing.

### Troubleshooting

**If you see 404 errors for routes like `/dashboard`:**

1. Check your server configuration - it must serve `index.html` for all routes
2. Ensure the `dist` folder is correctly deployed
3. Check server logs for routing errors
4. Verify that `index.html` is accessible at the root URL

**If routes work but assets (CSS/JS) don't load:**

1. Check that the `assets` folder is deployed
2. Verify the base path in `vite.config.ts` if using a subdirectory
3. Check browser console for 404 errors on asset files

