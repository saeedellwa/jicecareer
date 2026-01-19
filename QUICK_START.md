# JICE Career Platform - Quick Start (5 Minutes)

**TL;DR**: Deploy to Vercel in 3 steps, add domain in 2 steps, done!

---

## 3-Step Deployment

### 1️⃣ Create Accounts (Free - 5 mins)

```
Vercel    → vercel.com/signup
Neon DB   → neon.tech/signup  
Resend    → resend.com/signup
```

Get these keys:
- `DATABASE_URL` from Neon
- `RESEND_API_KEY` from Resend

### 2️⃣ Deploy to Vercel (5 mins)

**Option A: From v0**
- Click "Publish"
- Select GitHub
- Deploy

**Option B: From Vercel**
- vercel.com → "New Project"
- Import GitHub repo
- Add these env vars:
```env
DATABASE_URL=your_neon_url
JWT_SECRET=generate-random-32-chars
RESEND_API_KEY=your_resend_key
EMAIL_FROM=noreply@jicecareer.com
NEXT_PUBLIC_APP_URL=https://jicecareer.com
```
- Deploy

### 3️⃣ Test (1 min)

```
Home:  your-app.vercel.app
Admin: your-app.vercel.app/admin
```

✅ Works? Great! Now add your domain...

---

## 2-Step Domain Setup

### 1️⃣ Update DNS (5 mins)

At your domain registrar (where you bought jicecareer.com):

**Change nameservers to:**
```
ns1.vercel-dns.com
ns2.vercel-dns.com
ns3.vercel-dns.com
ns4.vercel-dns.com
```

**OR add CNAME:**
```
www → cname.vercel-dns.com
```

### 2️⃣ Wait for DNS (5-48 hours)

DNS propagates automatically. Check progress:
```
https://www.whatsmydns.net/?q=jicecareer.com
```

Once green ✅:
```
https://jicecareer.com → LIVE!
```

---

## Testing Checklist

```
□ Homepage loads
□ Can register user
□ Admin can approve
□ User gets email
□ User can upload CV
□ Admin can review CV
□ All features work
```

---

## Default Admin Account

```
Email:    admin@jicecareer.com
Password: (set during DB setup)
URL:      https://jicecareer.com/admin
```

**Change password immediately after first login!**

---

## Troubleshooting (2 mins)

| Issue | Fix |
|-------|-----|
| DB connection error | Check DATABASE_URL format |
| Emails not sending | Verify RESEND_API_KEY |
| Domain not working | Wait 24-48 hours |
| Login fails | Clear cookies, try again |

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed help.

---

## File References

| File | Purpose |
|------|---------|
| [README.md](./README.md) | Overview |
| [GETTING_STARTED.md](./GETTING_STARTED.md) | Step-by-step guide |
| [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) | Detailed deployment |
| [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md) | Configuration |
| [DOMAIN_SETUP.md](./DOMAIN_SETUP.md) | Domain details |
| [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) | What was built |

---

## Important URLs

```
Homepage:     https://jicecareer.com
Register:     https://jicecareer.com/register
Login:        https://jicecareer.com/login
Dashboard:    https://jicecareer.com/dashboard
Admin:        https://jicecareer.com/admin
```

---

## Environment Variables

```env
DATABASE_URL=postgresql://user:pass@host/db
JWT_SECRET=your-32-char-secret-here
RESEND_API_KEY=key_xxxxxxxxxxxxxx
EMAIL_FROM=noreply@jicecareer.com
NEXT_PUBLIC_APP_URL=https://jicecareer.com
```

---

## Success = 30 Minutes

1. **0-5 mins**: Create accounts
2. **5-10 mins**: Deploy to Vercel
3. **10-15 mins**: Test features
4. **15-20 mins**: Add domain DNS
5. **20-30 mins**: Wait for propagation

Then: **Domain live in 5-48 hours!**

---

## Cost

✅ **FREE**
- Vercel: $0 (100GB/month free)
- Neon: $0 (10GB free)
- Resend: $0 (100 emails/day free)

Cost: **~$10/year for domain only**

---

## What's Included

✅ Complete recruitment platform  
✅ Job seeker registration  
✅ Agent CV submission  
✅ Admin approval system  
✅ Email notifications  
✅ Professional design  
✅ Production-ready code  
✅ Complete documentation  

---

## Next Step

👉 **[GETTING_STARTED.md](./GETTING_STARTED.md)**

---

**Status**: ✅ Ready to Deploy  
**Time**: 30 minutes  
**Cost**: $0 (free tier)  
**Launch**: Let's go! 🚀
