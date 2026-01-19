# Connecting jicecareer.com Domain - Complete Guide

## Overview
You have bought the domain `jicecareer.com` and need to connect it to your Vercel deployment.

## Prerequisites
- Domain: jicecareer.com (purchased and with active DNS control panel)
- Vercel account with project deployed
- Access to domain registrar's dashboard

## Complete Steps

### Step 1: Deploy to Vercel

1. In v0 dashboard, click "Publish"
2. Connect to Vercel (or your GitHub account)
3. Follow the deployment wizard
4. Note your Vercel deployment URL (something like: `your-project.vercel.app`)

After deployment, your site will be available at:
- `your-project.vercel.app` (temporary URL)
- You'll add `jicecareer.com` next

### Step 2: Add Domain in Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Select your JICE Career project
3. Click **Settings** → **Domains**
4. Click **Add** or **Add Domain**
5. Enter: `jicecareer.com`
6. Click **Add**

Vercel will show you:
- **Nameservers** (if using NS records)
- **CNAME** records (if using CNAME)
- **A records** (if using A records)

### Step 3: Configure DNS at Your Registrar

You need to update your domain registrar's DNS settings. Where you bought your domain, look for:
- "DNS Management"
- "Nameservers"
- "DNS Records"
- "Domain Settings"

#### Option A: Using Vercel Nameservers (Recommended - Easiest)

Vercel will suggest using their nameservers. Follow these steps:

1. Go to your domain registrar (GoDaddy, Namecheap, etc.)
2. Find DNS/Nameserver settings
3. **Replace ALL existing nameservers with:**
   - `ns1.vercel-dns.com`
   - `ns2.vercel-dns.com`
   - `ns3.vercel-dns.com`
   - `ns4.vercel-dns.com`

4. **Remove old nameservers completely**
5. Save changes
6. Wait 5-48 hours for DNS propagation

**Verification:**
```bash
nslookup jicecareer.com
# Should show Vercel nameservers
```

#### Option B: Using CNAME Records (If Namservers Not Allowed)

If your registrar doesn't allow changing nameservers:

1. In Vercel, look for **CNAME** option
2. You'll see records like:
   - `cname.vercel-dns.com` (for www)

3. At your registrar, create these DNS records:

**For www subdomain:**
- Record Type: **CNAME**
- Name/Host: **www**
- Value: **cname.vercel-dns.com**
- TTL: 3600 (default)

**For apex domain (without www):**
- Record Type: **A**
- Name/Host: **@** (or leave blank)
- Value: **76.76.19.132** (Vercel's IP - check Vercel dashboard for current IP)
- TTL: 3600 (default)

4. Save all changes
5. Wait 5-48 hours for propagation

### Step 4: Wait for DNS Propagation

After changing DNS/CNAME records:
- **Immediate**: Changes might not take effect yet
- **5-30 minutes**: Most propagation happens
- **Up to 48 hours**: Some ISPs take longer

**Check status:**
```bash
# Check if DNS is propagated
nslookup jicecareer.com

# Or use online tool:
# https://www.whatsmydns.net/?q=jicecareer.com
```

### Step 5: Verify in Vercel

1. Go back to Vercel dashboard
2. In **Settings → Domains**
3. Your domain should show:
   - ✓ **Verified** (green checkmark)
   - **Valid Configuration**
   - **SSL Certificate: Valid** (automatic)

### Step 6: Test Your Domain

1. Wait for verification to complete
2. Visit: **https://jicecareer.com** in your browser
3. Should show your JICE Career platform
4. Check browser address bar - should show **https** (secure)

---

## Troubleshooting

### Domain still not working after 48 hours?

**Check your DNS records:**
```bash
# Check nameservers
nslookup -type=NS jicecareer.com

# Should return Vercel nameservers:
# ns1.vercel-dns.com
# ns2.vercel-dns.com
# ns3.vercel-dns.com
# ns4.vercel-dns.com
```

**Check if domain resolves:**
```bash
# Check A records
nslookup jicecareer.com

# Should return Vercel IP address
```

**Use online checker:**
- https://www.whatsmydns.net/?q=jicecareer.com
- https://www.nslookup.io/domains/jicecareer.com/dns-records/

### Issue: "Domain not found" or "Can't reach server"

**Possible causes:**
1. DNS not propagated yet (wait 24-48 hours)
2. Vercel project not deployed
3. DNS records not correctly set

**Solutions:**
1. Check Vercel dashboard - is project deployed?
2. Re-verify nameservers in registrar
3. Clear browser cache: Ctrl+Shift+Delete
4. Try different browser or device
5. Use VPN to test from different location

### Issue: "Not Secure" warning

**Solution:**
- Vercel provides free SSL automatically
- Wait 10-20 minutes after domain verification
- Hard refresh: Ctrl+F5
- SSL certificate status visible in Vercel dashboard

### Issue: "SSL Certificate Pending"

**Solution:**
- Vercel takes up to 24 hours to issue certificate
- Check back later
- No action needed - fully automatic

### Issue: www vs non-www

Both should work:
- `jicecareer.com` (apex domain)
- `www.jicecareer.com` (www subdomain)

Vercel automatically redirects between them.

---

## After Domain is Connected

### Email Configuration (Optional but Recommended)

To enable email sending verification for better deliverability:

1. In Resend dashboard (https://resend.com)
2. Go to **Domains**
3. Add domain: `jicecareer.com`
4. Verify ownership by adding DNS records provided by Resend
5. This improves email delivery rates

### Verify Everything Works

**Test user flow:**
1. Go to https://jicecareer.com
2. Register as job seeker
3. Check admin panel at https://jicecareer.com/admin
4. Verify emails are sending (check email_logs in database)

**Test all pages:**
- ✓ Home page: https://jicecareer.com
- ✓ Register: https://jicecareer.com/register
- ✓ Login: https://jicecareer.com/login
- ✓ Dashboard: https://jicecareer.com/dashboard
- ✓ Admin: https://jicecareer.com/admin

---

## Important Notes

### Security
- ✓ HTTPS/SSL is automatic via Vercel
- ✓ All data encrypted in transit
- ✓ Change admin password after first login
- ✓ Keep JWT_SECRET confidential

### Performance
- ✓ CDN automatically configured
- ✓ Global distribution via Vercel
- ✓ Automatic scaling for traffic spikes

### Monitoring
- Monitor Vercel dashboard for downtime
- Check email sending logs regularly
- Monitor database usage (Neon)
- Set up email quota alerts

---

## Registrar-Specific Instructions

### GoDaddy
1. Login to GoDaddy account
2. Go to **Domains** → Select `jicecareer.com`
3. Click **Manage DNS**
4. Find **Nameservers** section
5. Click **Change Nameservers**
6. Enter Vercel nameservers
7. Save

### Namecheap
1. Login to Namecheap
2. Go to **Manage Domains**
3. Select `jicecareer.com`
4. Click **Nameservers** tab
5. Select **Custom Nameservers**
6. Enter Vercel nameservers
7. Save changes

### Cloudflare
1. If using Cloudflare, go to **DNS** tab
2. Change **Nameservers** to Vercel's
3. Or add CNAME in Cloudflare's DNS

### Register.com / 1&1 / HostGator
1. Find **DNS Zone Editor** or **DNS Records**
2. Add Vercel's A record: `76.76.19.132`
3. Or replace nameservers with Vercel's

---

## Support

If you need help:
1. Check Vercel documentation: https://vercel.com/docs
2. Check domain registrar's help center
3. Verify DNS: https://www.whatsmydns.net
4. Check Vercel status: https://status.vercel.com

---

## Timeline Expectations

- **Immediately**: Changes submitted to registrar
- **5-30 minutes**: Most DNS propagation (95% of users)
- **1-24 hours**: Full propagation across world
- **5 minutes after DNS propagation**: SSL certificate issued
- **24-48 hours**: Maximum time to fully resolve

**Your domain will be live soon! 🚀**

---

**Created**: January 2026
**Domain**: jicecareer.com
**Status**: Ready for setup
