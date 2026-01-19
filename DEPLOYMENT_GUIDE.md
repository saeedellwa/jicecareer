# JICE Career Platform - Deployment Guide

## Overview
This is a complete recruitment platform built with Next.js, Supabase/Neon database, and email notifications.

## Prerequisites
- Vercel account (free tier available)
- Neon database (free tier available at neon.tech)
- Domain name (jicecareer.com)
- Email service (Resend, SendGrid, or similar - free tier available)

## Step 1: Setup Database

### Using Neon (PostgreSQL)
1. Go to https://neon.tech and create a free account
2. Create a new project
3. Copy your DATABASE_URL
4. Run the database schema:
   - In your v0 dashboard, execute: `scripts/01-init-schema.sql`

### Environment Variables Needed
```
DATABASE_URL=postgresql://user:password@host/database
JWT_SECRET=your-secret-key-here
RESEND_API_KEY=your-resend-api-key
EMAIL_FROM=noreply@jicecareer.com
NEXT_PUBLIC_APP_URL=https://jicecareer.com
```

## Step 2: Setup Email Service

### Using Resend (Recommended)
1. Go to https://resend.com
2. Sign up (free tier available)
3. Create API key
4. Verify your domain (jicecareer.com)
5. Add `RESEND_API_KEY` to environment variables

## Step 3: Deploy to Vercel

### Option 1: Using Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts to connect your project
```

### Option 2: Using GitHub
1. Push your code to GitHub
2. Go to vercel.com
3. Click "New Project"
4. Import your GitHub repository
5. Add environment variables in the "Environment Variables" section:
   - DATABASE_URL
   - JWT_SECRET
   - RESEND_API_KEY
   - EMAIL_FROM
   - NEXT_PUBLIC_APP_URL

## Step 4: Connect Custom Domain

### DNS Configuration for jicecareer.com
After deploying to Vercel, you'll get deployment domains. To use your custom domain:

1. Go to your domain registrar (where you bought jicecareer.com)
2. Find DNS settings
3. Add these DNS records:

#### Using Vercel's Nameservers (Recommended)
Replace all nameservers with Vercel's:
- ns1.vercel-dns.com
- ns2.vercel-dns.com

#### OR Using CNAME Records
- Record Type: CNAME
- Name: www
- Value: cname.vercel-dns.com

- Record Type: CNAME
- Name: (leave blank for root/apex)
- Value: cname.vercel-dns.com

### In Vercel Dashboard
1. Go to your project settings
2. Click "Domains"
3. Add your domain: jicecareer.com
4. Follow the instructions to verify ownership
5. Wait for DNS propagation (5-30 minutes)

## Step 5: Environment Variables Setup

Add these to Vercel project settings (Project Settings → Environment Variables):

```
DATABASE_URL=your_neon_database_url
JWT_SECRET=generate-a-random-secret-key
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=noreply@jicecareer.com
NEXT_PUBLIC_APP_URL=https://jicecareer.com
NODE_ENV=production
```

## Step 6: SSL Certificate
Vercel automatically provides free SSL certificates. Your domain will automatically have HTTPS.

## Testing the Deployment

1. Visit https://jicecareer.com
2. Test the landing page
3. Create a test account:
   - Go to /register
   - Create a job seeker or agent account
4. Login to /admin with the admin account:
   - Email: admin@jicecareer.com
   - Password: (the one you set in the database)
5. Test admin approval workflow

## API Endpoints Summary

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Admin
- `GET /api/admin/pending-users` - List pending user approvals
- `POST /api/admin/approve-user/[id]` - Approve user
- `POST /api/admin/reject-user/[id]` - Reject user
- `GET /api/admin/pending-cvs` - List pending CV reviews
- `POST /api/admin/approve-cv/[id]` - Approve CV
- `POST /api/admin/reject-cv/[id]` - Reject CV

### User
- `GET /api/user/cvs` - Get user's CVs
- `POST /api/user/upload-cv` - Upload new CV

## Important Notes

### Free Tier Limitations
- **Vercel**: 100GB bandwidth/month, unlimited deployments
- **Neon**: Up to 3 free projects, 10 GB storage
- **Resend**: 100 emails/day on free tier

### Security Considerations
1. Change the default JWT_SECRET in production
2. Use strong database passwords
3. Enable email domain verification in Resend
4. Implement rate limiting for APIs (optional)
5. Setup CORS properly for your domain

### First Time Admin Login
1. Database includes a default admin user:
   - Email: admin@jicecareer.com
   - Password: (as set in database initialization)
2. Change this password immediately after first login

### Email Setup
- Welcome emails are sent on account approval
- CV approval/rejection emails are sent automatically
- Check email logs in database table: `email_logs`

## Troubleshooting

### Domain Not Resolving
1. Wait 24-48 hours for DNS propagation
2. Check DNS records with: `nslookup jicecareer.com`
3. Clear browser cache and try again

### Emails Not Sending
1. Verify Resend API key is correct
2. Check email logs in database
3. Verify domain is verified in Resend dashboard

### Database Connection Issues
1. Check DATABASE_URL format
2. Verify IP whitelist in Neon (if applicable)
3. Test connection with: `psql your_database_url`

## File Structure
```
/app
  /api          - API routes
  /admin        - Admin dashboard
  /dashboard    - User dashboard
  /login        - Login page
  /register     - Registration page
/components
  /admin        - Admin components
  - navbar      - Top navigation
  - hero        - Hero section
  - jobs-section - Featured jobs
/lib
  - email.ts    - Email service
  - types.ts    - TypeScript types
  - supabase-client.ts
  - supabase-server.ts
/public
  - jice-logo.png
/scripts
  - 01-init-schema.sql - Database schema
```

## Support & Maintenance

### Regular Tasks
1. Monitor email quota (Resend free tier: 100/day)
2. Check database storage usage (Neon)
3. Monitor Vercel deployments and errors
4. Regular backups of database

### Updates
To update the application:
1. Make changes locally
2. Commit to GitHub
3. Vercel will auto-deploy on push
4. Monitor deployment in Vercel dashboard

---

**Deployment Status**: Ready for production
**Last Updated**: January 2026
