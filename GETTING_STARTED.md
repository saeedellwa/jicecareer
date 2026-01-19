# Getting Started with JICE Career Platform

Welcome! This guide will walk you through everything you need to do to launch your JICE Career platform.

## 📋 Your Journey (30 minutes to launch)

### Phase 1: Understanding (5 minutes)
- ✅ Read this file
- ✅ Review what was built

### Phase 2: Setup External Services (10 minutes)
- ✅ Create Neon database account
- ✅ Create Resend email account
- ✅ Create Vercel account

### Phase 3: Deploy (10 minutes)
- ✅ Deploy to Vercel
- ✅ Add environment variables
- ✅ Verify deployment

### Phase 4: Domain (5 minutes + DNS wait)
- ✅ Configure domain DNS
- ✅ Wait for propagation (5-48 hours)

---

## Complete Checklist

### Before You Start
- [ ] You have the domain: `jicecareer.com`
- [ ] You have access to registrar/DNS
- [ ] You have internet access
- [ ] You have 30 minutes

### Create Accounts (Free)
- [ ] Vercel account (vercel.com)
- [ ] Neon PostgreSQL (neon.tech)
- [ ] Resend Email (resend.com)

### Deploy
- [ ] Push code to GitHub (or use v0's publish)
- [ ] Connect to Vercel
- [ ] Add environment variables
- [ ] Deploy successfully

### Configure Domain
- [ ] Update DNS records
- [ ] Verify in Vercel
- [ ] Get SSL certificate
- [ ] Test domain

### Launch
- [ ] Change admin password
- [ ] Test registration flow
- [ ] Test admin approval
- [ ] Test email sending
- [ ] Go live!

---

## Step-by-Step Instructions

### Step 1: Create Neon Account (3 minutes)

**Purpose**: PostgreSQL database (free tier: 10GB storage)

1. Go to https://neon.tech
2. Click "Sign up"
3. Use Google or GitHub to sign up
4. Create new project
5. Copy your DATABASE_URL
6. Keep this safe - you'll need it!

**Example DATABASE_URL**:
```
postgresql://user:password@ep-xxx.neon.tech/database?sslmode=require
```

### Step 2: Create Resend Account (2 minutes)

**Purpose**: Send emails (free tier: 100 emails/day)

1. Go to https://resend.com
2. Click "Get Started"
3. Sign up with email
4. Create API key under "API Keys"
5. Copy the key
6. Keep this safe!

**Note**: You'll verify your domain later for better email delivery.

### Step 3: Create Vercel Account (2 minutes)

**Purpose**: Host your application

1. Go to https://vercel.com
2. Click "Sign Up"
3. Use GitHub or another provider
4. Create account
5. You're ready to deploy!

### Step 4: Prepare Environment Variables

Create a text file with these values:

```
DATABASE_URL=paste_your_neon_url_here
JWT_SECRET=generate_a_random_secret_here
RESEND_API_KEY=paste_your_resend_key_here
EMAIL_FROM=noreply@jicecareer.com
NEXT_PUBLIC_APP_URL=https://jicecareer.com
```

**How to generate JWT_SECRET**:
Go to terminal/command prompt and run:
```bash
# On Mac/Linux
openssl rand -base64 32

# On Windows (if using Git Bash)
openssl rand -base64 32

# If that doesn't work, generate online:
# https://www.random.org/strings/?num=1&len=32&digits=on&loweralpha=on&upperalpha=on
```

### Step 5: Deploy to Vercel (5 minutes)

**Option A: Using v0 (Easiest)**
1. In v0 dashboard, click "Publish"
2. Follow the wizard
3. Connect GitHub
4. Deploy

**Option B: Using Vercel Directly**
1. Push your code to GitHub
2. Go to vercel.com/dashboard
3. Click "New Project"
4. Import from GitHub
5. Add environment variables (see Step 4)
6. Click "Deploy"

**After Deployment**:
- ✅ Note your Vercel deployment URL (something like `jicecareer.vercel.app`)
- ✅ Verify site is live and loading

### Step 6: Configure Database (1 minute)

**Important**: The database schema is already created in `scripts/01-init-schema.sql`

Verify tables exist:
1. Go to Neon dashboard
2. Click your project
3. Open SQL Editor
4. Run: `SELECT * FROM users;`
5. Should show empty table (good!)

### Step 7: Test Login (2 minutes)

Admin account auto-created:
- Email: `admin@jicecareer.com`
- Password: (whatever you set during setup, or check database)

**Test it**:
1. Go to your Vercel URL
2. Click "Sign In"
3. Try the admin account
4. Should work!

### Step 8: Configure Domain (5 minutes)

In your **domain registrar** (where you bought jicecareer.com):

**Option A: Use Vercel Nameservers (Recommended)**
1. Find DNS Settings
2. Change nameservers to:
   - `ns1.vercel-dns.com`
   - `ns2.vercel-dns.com`
   - `ns3.vercel-dns.com`
   - `ns4.vercel-dns.com`
3. Save
4. **Wait 5-48 hours**

**Option B: Use CNAME Records**
If nameservers aren't available:
1. Create CNAME for `www`: `cname.vercel-dns.com`
2. Create A record for apex: `76.76.19.132`
3. Save
4. **Wait 5-48 hours**

### Step 9: Verify in Vercel (2 minutes)

1. Go to Vercel project settings
2. Click "Domains"
3. Add `jicecareer.com`
4. Should show "Verifying DNS"
5. Wait for ✅ "Valid Configuration"
6. SSL certificate auto-issued

### Step 10: Test Everything (5 minutes)

Once domain is live:

1. **Visit homepage**: https://jicecareer.com
2. **Test registration**: Register as job seeker
3. **Test admin**: Login as admin, approve the user
4. **Check email**: User should receive approval email
5. **Test dashboard**: Login as user, upload CV
6. **Admin review**: Admin reviews and approves CV
7. **Verify notification**: User gets CV approval email

---

## Common Setup Issues

### "Database connection error"
```
Error: database "..." does not exist
```
**Solution**: 
- Check DATABASE_URL is correct
- Verify Neon project still exists
- Test in Neon dashboard

### "Email not configured"
```
Error: RESEND_API_KEY not found
```
**Solution**:
- Copy exact API key from Resend
- Add to Vercel environment variables
- Redeploy project

### "Domain not resolving"
```
Your connection isn't private
```
**Solution**:
- Wait 24-48 hours for DNS
- Check DNS records are correct
- Use https://www.whatsmydns.net to check

### "Emails not sending"
**Solution**:
- Check RESEND_API_KEY is correct
- Check email address format
- Verify domain in Resend (optional)
- Check email_logs table for errors

---

## First Time Admin Setup

### 1. Change Admin Password
**IMPORTANT**: Change default admin password immediately!

1. Login as admin
2. Go to database
3. Update user password (hashed)
4. Or create new admin account

### 2. Verify Email Service
Send a test email:
1. As admin, register a test user
2. Should receive approval email
3. Check Resend dashboard
4. Should show "Sent"

### 3. Test Full Flow
1. Register new job seeker
2. Admin approves
3. User uploads CV
4. Admin approves CV
5. Verify all emails arrive

---

## Your First Week

### Day 1
- ✅ Deploy application
- ✅ Configure domain
- ✅ Change admin password
- ✅ Test basic flow

### Day 2-4
- DNS propagation (usually 5-48 hours)
- Test with domain name
- Verify emails working
- Test with real users

### Week 1
- Monitor platform
- Check email sending
- Review database size
- Plan next features

---

## File References

**For detailed information, read these files**:

1. **[README.md](./README.md)** - Project overview
2. **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Complete deployment details
3. **[SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md)** - Configuration guide
4. **[DOMAIN_SETUP.md](./DOMAIN_SETUP.md)** - Domain connection details
5. **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - What was built

---

## Support & Troubleshooting

### If Something Goes Wrong

**Step 1**: Check environment variables
```
Vercel Dashboard → Settings → Environment Variables
```

**Step 2**: Verify database connection
```
Neon Dashboard → SQL Editor → Test connection
```

**Step 3**: Check API errors
```
Vercel Dashboard → Logs → Function logs
```

**Step 4**: Read troubleshooting guides
- See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md#troubleshooting)
- See [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md#common-issues--solutions)

---

## Next Actions

### Right Now (5 minutes)
1. ✅ Read this file
2. ✅ Open [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

### Today (30 minutes)
1. Create Neon account
2. Create Resend account
3. Create Vercel account
4. Deploy application

### Tomorrow (5-48 hours)
1. Configure domain DNS
2. Wait for propagation
3. Test with live domain

### This Week
1. Change admin password
2. Test all features
3. Plan next steps

---

## Success Criteria

Your platform is successfully launched when:
- ✅ Website loads at https://jicecareer.com
- ✅ Registration works
- ✅ Admin can approve users
- ✅ Users receive emails
- ✅ CV upload works
- ✅ All features functional

---

## Estimated Costs (Free Tier)

| Service | Cost | Limit |
|---------|------|-------|
| Vercel | Free | 100GB/month |
| Neon | Free | 10GB storage |
| Resend | Free | 100 emails/day |
| Domain | ~$10/year | Your cost |
| **Total** | **~$10/year** | |

---

## Quick Reference

### Important URLs
- Landing page: https://jicecareer.com
- Register: https://jicecareer.com/register
- Login: https://jicecareer.com/login
- Dashboard: https://jicecareer.com/dashboard
- Admin: https://jicecareer.com/admin

### Key Accounts
- Admin email: `admin@jicecareer.com`
- Database: Neon PostgreSQL
- Email: Resend
- Hosting: Vercel

### Setup Time
- Vercel setup: 10 minutes
- Database setup: 1 minute
- Domain setup: 5 minutes
- DNS propagation: 5-48 hours
- **Total active time: ~30 minutes**

---

## You're All Set! 🎉

You now have everything you need to:
1. Deploy your platform
2. Connect your domain
3. Launch your recruitment platform

**Start here**: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

Good luck! Your JICE Career platform is ready to go! 🚀

---

**Version**: 1.0  
**Date**: January 2026  
**Status**: Ready to Launch  
**Next Step**: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
