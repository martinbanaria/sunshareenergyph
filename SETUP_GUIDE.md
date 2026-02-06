# SunShare Philippines - Setup & Deployment Guide

## 🚀 Quick Start

### 1. Environment Setup

Copy the environment template:
```bash
cp .env.example .env.local
```

### 2. Get Required API Keys

#### Supabase (Database & Auth)
1. Go to https://supabase.com/
2. Create account and new project:
   - Name: "SunShare Philippines"
   - Database password: Generate strong password
   - Region: Singapore (closest to Philippines)
3. Get your keys from Project Settings → API:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

#### hCaptcha (Bot Protection)
1. Go to https://www.hcaptcha.com/
2. Create account and add new site:
   - Domain: `localhost` (for dev)
   - Add `sunshareenergy.ph` (for production)
3. Get your keys:
   - `NEXT_PUBLIC_HCAPTCHA_SITEKEY`
   - `HCAPTCHA_SECRET`

#### Resend (Email Service)
1. Go to https://resend.com/
2. Create account and API key:
   - Name: "SunShare Philippines"
   - Permissions: Sending access
3. Get your key:
   - `RESEND_API_KEY`

### 3. Database Setup

1. **Copy the schema**: Open `supabase/schema.sql`
2. **Run in Supabase**: 
   - Go to SQL Editor in your Supabase dashboard
   - Paste and run the entire schema
3. **Setup storage**:
   - Go to Storage → Create bucket: `id-documents` (private)
   - Run `supabase/storage-policies.sql` in SQL Editor

### 4. Update Environment Variables

Update your `.env.local` file with all the API keys:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key

# hCaptcha
NEXT_PUBLIC_HCAPTCHA_SITEKEY=your_actual_sitekey
HCAPTCHA_SECRET=your_actual_secret

# Resend (Email)
RESEND_API_KEY=re_your_actual_api_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Test Locally

```bash
npm run dev
```

Visit http://localhost:3000/onboarding and test the complete flow!

---

## 🧪 Testing Guide

### Manual Testing Checklist

#### ✅ Step 1: Account Creation
- [ ] Fill all required fields
- [ ] Test Philippine phone validation (`+639xxxxxxxxx`)
- [ ] Test password strength requirements
- [ ] Test hCaptcha verification
- [ ] Test form validation errors

#### ✅ Step 2: ID Upload
- [ ] Upload each ID type (PhilID, Driver's License, etc.)
- [ ] Test mobile camera capture
- [ ] Test OCR extraction
- [ ] Test manual editing of extracted data
- [ ] Test file size limits (10MB max)

#### ✅ Step 3: Property Details
- [ ] Test all property types
- [ ] Test ownership options
- [ ] Test address auto-fill from OCR
- [ ] Test manual address entry

#### ✅ Step 4: Preferences
- [ ] Test multiple service selections
- [ ] Test bill range selection
- [ ] Test referral source options

#### ✅ Step 5: Review & Submit
- [ ] Test data review accuracy
- [ ] Test editing previous steps
- [ ] Test terms/privacy checkboxes
- [ ] Test submission success
- [ ] Test welcome email delivery

### Cross-Device Testing
- [ ] Desktop (Chrome, Firefox, Safari)
- [ ] Mobile iOS (Safari, Chrome)
- [ ] Mobile Android (Chrome, Samsung Browser)
- [ ] Tablet (iPad, Android)

### Error Handling Testing
- [ ] Network failures during submission
- [ ] Invalid file uploads
- [ ] Duplicate email registration
- [ ] Missing required fields
- [ ] hCaptcha timeout

---

## 🚢 Deployment to Vercel

### 1. Connect Repository
1. Go to https://vercel.com/
2. Import your GitHub repository
3. Select "SunShare Energy PH" project

### 2. Configure Environment Variables
In Vercel dashboard → Settings → Environment Variables, add:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_HCAPTCHA_SITEKEY=your_sitekey
HCAPTCHA_SECRET=your_secret
RESEND_API_KEY=your_resend_key
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

### 3. Deploy
- Push to main branch
- Vercel auto-deploys
- Test at your Vercel URL

### 4. Custom Domain (Optional)
- Add `sunshareenergy.ph` in Vercel domains
- Update DNS records
- Update `NEXT_PUBLIC_APP_URL`

---

## 📊 Testing Infrastructure

### Analytics & Monitoring
- Form completion rates by step
- Drop-off analysis
- Device/browser usage
- Performance metrics

### Feedback Collection
- Embedded feedback widgets
- User testing surveys
- Error reporting

### A/B Testing Ready
- Step order optimization
- Form field variations
- UI/UX improvements

---

## ⚠️ Important Notes

### Security
- All user data encrypted in transit and at rest
- Row Level Security (RLS) enabled
- File uploads validated and size-limited
- CORS properly configured

### Performance
- Images optimized
- Lazy loading implemented
- Form data auto-saved
- Mobile-first responsive design

### Philippine Localization
- Phone number format: `+639xxxxxxxxx`
- ID types: PhilID, Driver's License, SSS, UMID, etc.
- Address format: Barangay, City, Province
- Timezone: Asia/Manila

---

## 🆘 Troubleshooting

### Common Issues

**"Failed to send email"**
- Check Resend API key
- Verify domain configuration
- Check rate limits

**"Database connection failed"**
- Verify Supabase URL/key
- Check RLS policies
- Ensure tables exist

**"hCaptcha not working"**
- Verify site key matches domain
- Check localhost in hCaptcha config
- Test with different browsers

### Getting Help

- 📧 Email: dev@sunshareenergy.ph
- 💬 GitHub Issues: Repository issues
- 📞 Direct support: Available during setup

---

## 🎯 Next Steps After Deployment

1. **User Testing**: Share with 10-20 beta users
2. **Feedback Analysis**: Collect and implement improvements
3. **Performance Optimization**: Based on real usage data
4. **Admin Dashboard**: For reviewing applications
5. **Email Automation**: Welcome sequence and follow-ups