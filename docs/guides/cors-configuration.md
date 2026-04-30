# CORS Configuration Guide

## Overview

CORS (Cross-Origin Resource Sharing) memungkinkan client di domain berbeda untuk mengakses API server.

---

## Configuration

### Server (.env)

```env
CORS_ORIGINS=http://localhost:5173
```

### Multiple Origins

Untuk multiple domains, gunakan comma-separated list (tanpa spaces):

```env
CORS_ORIGINS=http://localhost:5173,https://wedspace.vercel.app,https://wedspace.com
```

---

## Development

### Local Development
```env
CORS_ORIGINS=http://localhost:5173
```

- Client: `http://localhost:5173`
- Server: `http://localhost:3001`

---

## Production

### Vercel + Railway

```env
CORS_ORIGINS=https://wedspace.vercel.app,https://wedspace.com
```

- Client: `https://wedspace.vercel.app` (Vercel)
- Server: `https://your-railway-domain.up.railway.app` (Railway)
- Custom Domain: `https://wedspace.com`

### Vercel + Render

```env
CORS_ORIGINS=https://wedspace.vercel.app,https://wedspace.com
```

- Client: `https://wedspace.vercel.app` (Vercel)
- Server: `https://your-render-domain.onrender.com` (Render)
- Custom Domain: `https://wedspace.com`

---

## Common Issues

### CORS Error in Browser
```
Access to XMLHttpRequest at 'http://localhost:3001/api/...' 
from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Solution**: Check CORS_ORIGINS in server/.env
```env
CORS_ORIGINS=http://localhost:5173
```

### Multiple Origins Not Working
```env
# ❌ WRONG (spaces)
CORS_ORIGINS=http://localhost:5173, https://wedspace.vercel.app

# ✅ CORRECT (no spaces)
CORS_ORIGINS=http://localhost:5173,https://wedspace.vercel.app
```

### Production CORS Errors
- Verify CORS_ORIGINS includes your Vercel domain
- Check for typos in domain names
- Ensure HTTPS is used in production
- Restart server after changing CORS_ORIGINS

---

## Implementation

### Server Code (Express)

```javascript
const cors = require('cors')
const corsOrigins = process.env.CORS_ORIGINS?.split(',') || []

app.use(cors({
  origin: corsOrigins,
  credentials: true
}))
```

---

## Best Practices

### Development
- ✅ Use `http://localhost:5173`
- ✅ Keep it simple

### Production
- ✅ Use HTTPS only
- ✅ List specific domains
- ✅ Avoid wildcards (*)
- ✅ Restart server after changes

---

## Troubleshooting

1. Check CORS_ORIGINS in server/.env
2. Verify no typos in domain names
3. Ensure no trailing slashes
4. Check for spaces in comma-separated list
5. Restart server after changes
6. Check browser console for exact error

---

**See Also**: [Environment Configuration](./environment.md)
