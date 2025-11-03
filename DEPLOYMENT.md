# Vue.js Frontend Deployment Guide

## Quick Deployment

### One Command Deployment
```bash
./deploy.sh
```

This single command will:
1. ✅ Test SSH connection to VPS
2. ✅ Upload your latest code changes
3. ✅ Install dependencies on the server
4. ✅ Build production bundle
5. ✅ Create backup of previous version
6. ✅ Set correct permissions
7. ✅ Reload Nginx

---

## Development Workflow

### 1. Local Development
```bash
# Start development server
pnpm dev

# Test production build locally
pnpm build
pnpm preview
```

### 2. Make Your Changes
- Edit your Vue components, styles, etc.
- Test locally with `pnpm dev`
- Commit to git when satisfied

### 3. Deploy to Production
```bash
./deploy.sh
```

### 4. Verify Deployment
- Visit: https://ithdp.ir
- Check browser console for errors
- Test API calls
- Test SPA routing

---

## VPS Configuration

- **VPS IP**: 5.182.44.108:3031
- **Domain**: https://ithdp.ir
- **Backend API**: https://api.ithdp.ir
- **VPS Path**: /var/www/vueend
- **User**: deploy

---

## Manual Deployment (if needed)

### Upload Files Only
```bash
rsync -avz --progress \
    --exclude='node_modules/' \
    --exclude='.git/' \
    --exclude='dist/' \
    -e "ssh -p 3031" \
    ./ deploy@5.182.44.108:/var/www/vueend/
```

### Build on VPS
```bash
ssh deploy@5.182.44.108 -p 3031
cd /var/www/vueend
pnpm install
pnpm run build
sudo chown -R deploy:www-data dist/
sudo systemctl reload nginx
```

---

## Troubleshooting

### 1. SSH Connection Failed
```bash
# Test SSH manually
ssh deploy@5.182.44.108 -p 3031

# If fails, check:
# - Is VPS running?
# - Is port 3031 correct?
# - Are SSH keys configured?
```

### 2. Build Failed
```bash
# Check logs on VPS
ssh deploy@5.182.44.108 -p 3031
cd /var/www/vueend
pnpm run build
# Review error messages
```

### 3. Website Not Loading
```bash
# Check Nginx logs
ssh deploy@5.182.44.108 -p 3031
tail -f /var/log/nginx/vueend-error.log

# Check if Nginx is running
sudo systemctl status nginx

# Restart Nginx
sudo systemctl restart nginx
```

### 4. API Calls Failing (CORS)
```bash
# Verify backend CORS settings
ssh deploy@5.182.44.108 -p 3031
cd /var/www/laraend
cat .env | grep FRONTEND_URL
# Should show: FRONTEND_URL=https://ithdp.ir

# If wrong, update and restart
sudo nano .env
php artisan config:clear
php artisan config:cache
sudo systemctl restart php8.4-fpm
```

### 5. Rollback to Previous Version
```bash
ssh deploy@5.182.44.108 -p 3031
cd /var/www/vueend

# List backups
ls -lh /home/deploy/backups/frontend/

# Restore a backup (replace DATE with actual backup date)
tar -xzf /home/deploy/backups/frontend/frontend-DATE.tar.gz -C .
sudo chown -R deploy:www-data dist/
sudo systemctl reload nginx
```

---

## Environment Variables

The production build uses `.env.production`:

```env
VITE_API_BASE_URL=https://api.ithdp.ir
VITE_APP_NAME=Hakim Yar
VITE_APP_ENV=production
```

⚠️ **Note**: `.env.production` is in `.gitignore`, but it's uploaded during deployment.

---

## Monitoring

### Check Logs
```bash
# Nginx access log
ssh deploy@5.182.44.108 -p 3031
tail -f /var/log/nginx/vueend-access.log

# Nginx error log
tail -f /var/log/nginx/vueend-error.log
```

### Check Service Status
```bash
ssh deploy@5.182.44.108 -p 3031
sudo systemctl status nginx
```

---

## Security Checklist

- ✅ SSL configured (Cloudflare Full mode)
- ✅ HTTPS only (HTTP redirects to HTTPS)
- ✅ Security headers configured in Nginx
- ✅ File permissions set correctly (755 for dist/)
- ✅ CORS configured on backend
- ✅ API uses Bearer token authentication

---

## Best Practices

1. **Always test locally first**
   ```bash
   pnpm dev
   ```

2. **Commit to git before deploying**
   ```bash
   git add .
   git commit -m "Your changes"
   ./deploy.sh
   ```

3. **Never edit files directly on VPS**
   - Always edit locally and deploy

4. **Monitor logs after deployment**
   ```bash
   ssh deploy@5.182.44.108 -p 3031
   tail -f /var/log/nginx/vueend-error.log
   ```

5. **Keep backups**
   - Automatic backups are created in `/home/deploy/backups/frontend/`
   - Keep at least last 5 backups

---

## Support

- **Frontend**: https://ithdp.ir
- **Backend API**: https://api.ithdp.ir
- **VPS**: 5.182.44.108:3031
- **Deployment Script**: `./deploy.sh`

---

**Last Updated**: November 3, 2025

