# Troubleshooting Guide

## Common Issues & Solutions

### PostgreSQL Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution**: Pastikan PostgreSQL service running
```bash
# macOS
brew services start postgresql

# Linux
sudo systemctl start postgresql

# Windows
# Start PostgreSQL dari Services
```

---

### Database Already Exists
Jika ingin reset database:
```bash
cd server
npm run init
# Script akan drop dan recreate semua tables
```

---

### Port Already in Use
Jika port 3001 atau 5173 sudah digunakan:
```bash
# Change server port di server/.env
PORT=3002

# Change client port di client/vite.config.js
```

---

### Dependencies Installation Failed
```bash
# Clear npm cache
npm cache clean --force

# Reinstall
npm run install:all
```

---

### Build Errors
```bash
# Clear build cache
rm -rf client/dist
rm -rf node_modules
npm run install:all
npm run build
```

---

### Database Migration Failed
```
Error: relation "users" does not exist
```

**Solution**: Run migration again
```bash
cd server
npm run migrate
```

---

### CORS Errors
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution**: Check CORS_ORIGINS in server/.env
```bash
# Should match client URL
CORS_ORIGINS=http://localhost:5173
```

---

### Login Not Working
1. Check demo credentials: `demo@wedspace.id` / `demo123`
2. Verify database has demo user:
   ```bash
   psql -U dwikyalvin76 -d wedspace
   SELECT * FROM users;
   ```
3. Check JWT_SECRET in server/.env

---

### Data Not Showing
1. Verify workspace exists:
   ```bash
   SELECT * FROM workspaces;
   ```
2. Check browser console for errors
3. Verify API is responding:
   ```bash
   curl http://localhost:3001/api/auth/me \
     -H "Authorization: Bearer <token>"
   ```

---

### Hot Reload Not Working
**Client**: 
- Vite should auto-reload
- Check if file is saved
- Restart dev server if needed

**Server**:
- Manual restart required
- Or use `nodemon` for auto-restart:
  ```bash
  npm install -g nodemon
  nodemon server/index.js
  ```

---

### Environment Variables Not Loading
1. Check .env file exists in correct location
2. Verify variable names are correct
3. Restart server after changing .env
4. Check for typos in variable names

---

### Database Connection String Issues
```
Error: password authentication failed
```

**Solution**: Verify DATABASE_URL format
```
postgresql://username:password@localhost:5432/database_name
```

- Check username and password
- Verify database name is correct
- Ensure PostgreSQL user has correct permissions

---

### Module Not Found Errors
```
Cannot find module 'pg'
```

**Solution**: Reinstall dependencies
```bash
cd server
npm install
```

---

### Build Size Warning
```
Some chunks are larger than 500 kB after minification
```

**Note**: This is a warning, not an error. Build is still successful.

**To fix** (optional):
- Use dynamic imports for large components
- Enable code splitting in vite.config.js

---

## Getting Help

1. Check [Installation Guide](./installation.md)
2. Check [Environment Setup](./environment.md)
3. Check server logs: `npm run server`
4. Check browser console: F12 → Console tab
5. Check database: `psql -U username -d wedspace`

---

## Still Having Issues?

1. Verify all steps in [Installation Guide](./installation.md)
2. Check [Environment Setup](./environment.md)
3. Review error messages carefully
4. Check logs in both server and browser console
5. Try restarting both server and client

---

**Last Updated**: May 1, 2026
