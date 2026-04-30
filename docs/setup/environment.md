# Environment Configuration

## Overview

Wedspace menggunakan environment variables untuk konfigurasi development dan production.

---

## Server Configuration

### Location
```
server/.env
```

### Variables

#### Database
```env
DATABASE_URL=postgresql://username:password@localhost:5432/wedspace
```
- **Development**: Local PostgreSQL
- **Production**: Managed PostgreSQL (Railway/Render)

#### JWT
```env
JWT_SECRET=wedspace_jwt_secret_change_in_production_2025
JWT_EXPIRES_IN=7d
```
- **JWT_SECRET**: Secret key untuk signing tokens (change in production!)
- **JWT_EXPIRES_IN**: Token expiration time

#### Server
```env
PORT=3001
NODE_ENV=development
```
- **PORT**: Server port (default: 3001)
- **NODE_ENV**: Environment (development/production)

#### CORS
```env
CORS_ORIGINS=http://localhost:5173
```
- **Development**: `http://localhost:5173`
- **Production**: Your Vercel domain (comma-separated for multiple)
- Example: `https://wedspace.vercel.app,https://wedspace.com`

---

## Client Configuration

### Location
```
client/.env
```

### Variables

#### API
```env
VITE_API_BASE_URL=http://localhost:3001/api
```
- **Development**: `http://localhost:3001/api`
- **Production**: Set in Vercel environment variables
- Example: `https://your-railway-domain.up.railway.app/api`

---

## Development Setup

### 1. Copy Environment Files
```bash
# Server
cp server/.env.example server/.env

# Client
cp client/.env.example client/.env
```

### 2. Update Values (if needed)
```bash
# server/.env
DATABASE_URL=postgresql://your_user:your_password@localhost:5432/wedspace
JWT_SECRET=your_secret_key_here
PORT=3001
NODE_ENV=development
CORS_ORIGINS=http://localhost:5173

# client/.env
VITE_API_BASE_URL=http://localhost:3001/api
```

### 3. Verify Setup
```bash
# Check server can connect to database
cd server
npm run setup-db

# Check client can reach API
npm run client
# Open http://localhost:5173 in browser
```

---

## Production Setup

### Server (Railway/Render)

1. **Create PostgreSQL Database**
   - Use Railway or Render managed database
   - Get connection string

2. **Set Environment Variables**
   ```
   DATABASE_URL=postgresql://...
   JWT_SECRET=your_production_secret_key
   JWT_EXPIRES_IN=7d
   PORT=3001
   NODE_ENV=production
   CORS_ORIGINS=https://your-domain.com
   ```

3. **Deploy Server**
   - Push to GitHub
   - Connect to Railway/Render
   - Deploy

### Client (Vercel)

1. **Set Environment Variables**
   - Go to Vercel Dashboard
   - Project Settings → Environment Variables
   - Add: `VITE_API_BASE_URL=https://your-api-domain.com/api`

2. **Deploy Client**
   - Push to GitHub
   - Vercel auto-deploys
   - Or manually deploy

---

## Environment Variables Reference

### Server (.env)

| Variable | Example | Description |
|----------|---------|-------------|
| DATABASE_URL | postgresql://user:pass@localhost:5432/wedspace | Database connection string |
| JWT_SECRET | my_secret_key_123 | Secret for JWT signing |
| JWT_EXPIRES_IN | 7d | Token expiration time |
| PORT | 3001 | Server port |
| NODE_ENV | development | Environment type |
| CORS_ORIGINS | http://localhost:5173 | Allowed CORS origins |

### Client (.env)

| Variable | Example | Description |
|----------|---------|-------------|
| VITE_API_BASE_URL | http://localhost:3001/api | API base URL |

---

## Security Best Practices

### Development
- ✅ Use default values in .env.example
- ✅ Never commit .env files
- ✅ Use weak secrets (it's local only)

### Production
- ✅ Use strong JWT_SECRET (32+ characters)
- ✅ Use managed database (Railway/Render)
- ✅ Set NODE_ENV=production
- ✅ Use HTTPS for CORS_ORIGINS
- ✅ Rotate JWT_SECRET periodically
- ✅ Never expose secrets in code

---

## Troubleshooting

### Database Connection Failed
- Check DATABASE_URL format
- Verify PostgreSQL is running
- Check username and password
- Verify database exists

### CORS Errors
- Check CORS_ORIGINS matches client URL
- Verify no trailing slashes
- Check for typos in domain

### API Not Responding
- Check VITE_API_BASE_URL
- Verify server is running
- Check server logs for errors
- Verify JWT_SECRET is set

### Token Expiration Issues
- Check JWT_EXPIRES_IN format (e.g., "7d", "24h")
- Verify JWT_SECRET hasn't changed
- Check token in browser localStorage

---

## Environment Files

### .env.example
```env
DATABASE_URL=postgresql://username:password@localhost:5432/wedspace
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
PORT=3001
CORS_ORIGINS=http://localhost:5173
```

### .gitignore
```
.env
.env.local
.env.*.local
```

---

**Next**: See [Installation Guide](./installation.md) to get started
