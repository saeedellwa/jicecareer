# JICE Career Platform - Setup Instructions

## Quick Start Guide

### Step 1: Environment Variables
You need to set up these environment variables in your Vercel project:

```
DATABASE_URL=your_database_url_from_neon
JWT_SECRET=your_random_secret_key_min_32_chars
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=noreply@jicecareer.com
NEXT_PUBLIC_APP_URL=https://jicecareer.com  (or your staging URL)
```

**How to get these:**

#### DATABASE_URL
1. Sign up at neon.tech (free PostgreSQL)
2. Create new project
3. Copy connection string under "Connection" → "Connection string"
4. Format: `postgresql://user:password@host.neon.tech/database`

#### JWT_SECRET
Generate a secure random string (32+ characters):
```bash
openssl rand -base64 32
```

#### RESEND_API_KEY
1. Sign up at resend.com (free email service - 100 emails/day)
2. Go to API Keys
3. Create new API key
4. Copy and paste

#### EMAIL_FROM
Use: `noreply@jicecareer.com` (or any valid email address)

#### NEXT_PUBLIC_APP_URL
- Development: `http://localhost:3000`
- Production: `https://jicecareer.com`

### Step 2: Database Setup
The database schema has already been created. Verify by checking:
- `scripts/01-init-schema.sql` was executed successfully
- Tables exist: users, individuals, agents, cv_submissions, agent_cv_submissions, notifications, email_logs

### Step 3: Admin Account
Default admin credentials (in database):
- Email: `admin@jicecareer.com`
- Password: (the one set during database setup)

Change this password immediately after first login!

### Step 4: Deploy to Vercel
1. Click "Publish" button in v0
2. Connect to GitHub/Vercel
3. Add environment variables to Vercel project
4. Deploy

### Step 5: Connect Domain

#### Point Domain DNS to Vercel
In your domain registrar (where you bought jicecareer.com):

**Option A: Use Vercel Nameservers (Easier)**
- Replace all nameservers with:
  - ns1.vercel-dns.com
  - ns2.vercel-dns.com

**Option B: Use CNAME**
- Create CNAME record: `www` → `cname.vercel-dns.com`
- Create A record pointing to Vercel's IP

**In Vercel Dashboard:**
1. Project Settings → Domains
2. Add: `jicecareer.com`
3. Verify DNS (wait 5-30 minutes for propagation)

---

## Feature Overview

### For Job Seekers (Individuals)
1. **Register** at `/register?type=individual`
   - Full name
   - Email
   - Password
   - Wait for admin approval

2. **After Approval**
   - Login to `/dashboard`
   - Upload CV (PDF, DOC, DOCX)
   - Enter passport number
   - Wait for CV approval

3. **CV Status**
   - Pending: Under admin review
   - Approved: Your profile is complete
   - Rejected: Update CV and resubmit

### For Recruitment Agents
1. **Register** at `/register?type=agent`
   - Full name
   - Company name
   - Email
   - Password
   - Wait for admin approval

2. **After Approval**
   - Login to `/dashboard`
   - Upload multiple CVs with:
     - CV file
     - Passport number
     - Applicant full name
   - Search CVs by passport number
   - Track status of each CV

### For Admin
1. **Access** at `/admin`
   - Auto-redirects based on user type

2. **User Approvals Tab**
   - View pending user registrations
   - Approve or reject each user
   - Rejection/approval email sent automatically

3. **CV Reviews Tab**
   - View pending CV submissions
   - View CV file (opens in new tab)
   - Approve or reject each CV
   - Applicant notified via email

---

## Email Workflow

### User Registration
```
User Registers → Awaits Admin Approval → Admin Approves/Rejects
  ↓                                          ↓
Email sent about status               Email sent to user
```

### CV Submission
```
User Uploads CV → Admin Reviews → Admin Approves/Rejects
                                        ↓
                            Email sent to applicant
```

### Email Templates
Check `/lib/email.ts` for customization:
- `approvalNotification` - Account approved
- `rejectionNotification` - Account rejected
- `cvApprovedNotification` - CV approved
- `cvRejectedNotification` - CV rejected

---

## Database Schema

### Tables
1. **users** - All user accounts
   - Columns: id, email, password_hash, full_name, user_type, approval_status, created_at

2. **individuals** - Job seeker profiles
   - Columns: id, user_id, phone_number, date_of_birth, nationality

3. **agents** - Agent profiles
   - Columns: id, user_id, company_name, license_number, phone_number

4. **cv_submissions** - CVs from individuals
   - Columns: id, individual_id, cv_file_url, passport_number, submission_status, reviewed_at, reviewed_by

5. **agent_cv_submissions** - CVs from agents
   - Columns: id, agent_id, cv_file_url, passport_number, applicant_full_name, submission_status, reviewed_at, reviewed_by

6. **notifications** - In-app notifications
   - Columns: id, user_id, title, message, is_read, created_at

7. **email_logs** - Email sending history
   - Columns: id, user_id, email_address, email_type, status, sent_at, error_message

---

## Common Issues & Solutions

### "Database connection failed"
- Check DATABASE_URL format
- Verify Neon connection is active
- Test with: `psql your_database_url`

### "Emails not sending"
- Verify RESEND_API_KEY is correct
- Check Resend dashboard for API key status
- Verify domain is verified in Resend
- Check email_logs table for errors

### "Login failing"
- Verify JWT_SECRET matches between instances
- Check user approval_status in database
- Clear browser cookies and try again

### "Domain not working"
- Wait 24-48 hours for DNS propagation
- Verify DNS records are correctly set
- Check Vercel project domains page
- Use `dig jicecareer.com` to verify DNS

### "File upload not working"
- Verify file is PDF/DOC/DOCX
- Check browser console for errors
- Verify API endpoint `/api/user/upload-cv` is accessible

---

## Development vs Production

### Local Development
```bash
npm run dev
# http://localhost:3000
```

Environment:
- DATABASE_URL (local or remote)
- NEXT_PUBLIC_APP_URL=http://localhost:3000

### Production (Vercel)
- Automatic deployments on GitHub push
- All environment variables set in Vercel dashboard
- NEXT_PUBLIC_APP_URL=https://jicecareer.com
- SSL certificate auto-configured

---

## Performance & Limits

### Free Tier Limits (Important!)
- **Vercel**: 100GB bandwidth/month
- **Neon**: 10GB storage, 1GB RAM
- **Resend**: 100 emails/day (free tier)

### Optimization Tips
1. Monitor email quota (Resend)
2. Archive old logs regularly
3. Optimize images and assets
4. Use Vercel's Analytics dashboard
5. Set up alerts for quota warnings

---

## Support & Next Steps

### After Deployment
1. Test all features
2. Change admin password
3. Configure email domain properly
4. Setup monitoring
5. Plan backup strategy

### Maintenance Schedule
- Weekly: Check error logs
- Monthly: Review database usage
- Quarterly: Update dependencies
- Annually: Review security settings

### To Customize
- Colors/Design: Edit `/app/globals.css`
- Emails: Edit `/lib/email.ts`
- API Logic: Edit `/app/api/**`
- UI Components: Edit `/components/**`
- Pages: Edit `/app/**`

---

**Version**: 1.0.0
**Last Updated**: January 2026
**Status**: Production Ready
