# RENDER DEPLOYMENT SETTINGS

## Web Service Configuration

### Basic Settings
- **Name:** SOTOS
- **Language:** Node
- **Branch:** main
- **Region:** Oregon (US West)
- **Instance Type:** Free ($0/month)

### Build & Deploy
- **Root Directory:** backend
- **Build Command:** `npm install`
- **Start Command:** `npm start`

### Environment Variables (REQUIRED)
Add these in the Render dashboard:

```
DATABASE_URL = postgresql://sluff_db_user:x8JZaL7JJiOOKImyJyhqknZPU1OqbGEA@dpg-d1hp6enfte5s73aji2dg-a/sluff_db

NODE_ENV = production

CORS_ORIGIN = https://sotos-tournament.netlify.app

PORT = 10000
```

## Your Service Info
- **GitHub Repo:** https://github.com/mmcmillan1999/SOTOS
- **Service URL:** https://sotos.onrender.com
- **Service ID:** srv-d2u7s6ogjchc73c0htf0

## Quick Deploy Steps
1. Go to Render Dashboard
2. Click "New" → "Web Service"
3. Connect GitHub repo: mmcmillan1999/SOTOS
4. Enter settings above
5. Add environment variables
6. Click "Create Web Service"

## Database Connection (Already Exists)
Using your existing PostgreSQL database:
- **Database:** sluff-db
- **Service ID:** dpg-d1hp6enfte5s73aji2dg-a
- **Internal URL:** postgresql://sluff_db_user:x8JZaL7JJiOOKImyJyhqknZPU1OqbGEA@dpg-d1hp6enfte5s73aji2dg-a/sluff_db

---

# NETLIFY DEPLOYMENT SETTINGS

## Site Configuration

### Basic Settings
- **Site Name:** sotos-tournament
- **Repository:** https://github.com/mmcmillan1999/SOTOS

### Build Settings
- **Base Directory:** frontend
- **Build Command:** `npm run build`
- **Publish Directory:** frontend/build

### Environment Variables
Add in Netlify dashboard:

```
REACT_APP_API_URL = https://sotos.onrender.com
```

## Quick Deploy Steps
1. Go to Netlify Dashboard
2. Click "Add new site" → "Import an existing project"
3. Connect GitHub: mmcmillan1999/SOTOS
4. Enter settings above
5. Click "Deploy site"

---

## Post-Deployment Checklist

- [ ] Render backend is running at https://sotos.onrender.com
- [ ] Netlify frontend is running at https://sotos-tournament.netlify.app
- [ ] Database tables created (automatic on first run)
- [ ] CORS is configured correctly
- [ ] Admin logins work (Matt/Tug/Jenny with password "123")
- [ ] Real-time updates via Socket.io working
- [ ] Mobile responsive design verified

## Troubleshooting

**If backend doesn't start:**
- Check environment variables are set
- Verify database connection string
- Check Render logs for errors

**If frontend can't connect:**
- Verify REACT_APP_API_URL is set correctly
- Check CORS_ORIGIN matches your Netlify URL
- Ensure both services are deployed

**Database issues:**
- Tables auto-create on first run
- Using existing sluff-db with fairplay schema
- Check PostgreSQL connection string