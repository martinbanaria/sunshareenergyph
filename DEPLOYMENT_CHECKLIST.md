# 🚀 Deployment Checklist - SunShare Philippines Onboarding

## ✅ Pre-Deployment Checklist

### 1. **API Keys Setup** (Required)
- [ ] **Supabase Project Created** 
  - [ ] Database schema deployed (`supabase/schema.sql`)
  - [ ] Storage bucket created (`id-documents`)
  - [ ] Storage policies applied (`supabase/storage-policies.sql`)
  - [ ] SUPABASE_URL and SUPABASE_ANON_KEY obtained

- [ ] **hCaptcha Account Setup**
  - [ ] Site registered at hcaptcha.com
  - [ ] Domains added: `localhost`, `your-vercel-domain`, `sunshareenergy.ph`
  - [ ] HCAPTCHA_SITEKEY and HCAPTCHA_SECRET obtained

- [ ] **Resend Email Service**
  - [ ] Account created at resend.com
  - [ ] API key generated
  - [ ] RESEND_API_KEY obtained

### 2. **Environment Variables** (Copy to Vercel)
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_HCAPTCHA_SITEKEY=your_sitekey
HCAPTCHA_SECRET=your_secret
RESEND_API_KEY=re_your_api_key
NEXT_PUBLIC_APP_URL=https://your-vercel-app.vercel.app
```

### 3. **Local Testing** (Must Pass)
- [ ] Build process successful (`npm run build`)
- [ ] All pages load without errors
- [ ] Onboarding flow works end-to-end
- [ ] Form validation working
- [ ] File upload functional (with dummy OCR)
- [ ] No TypeScript errors

---

## 🌐 Vercel Deployment Steps

### Step 1: **Connect Repository**
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Select "sunshareenergyph" folder

### Step 2: **Configure Project Settings**
1. **Framework Preset**: Next.js
2. **Root Directory**: `sunshareenergyph` (if in monorepo)
3. **Build Command**: `npm run build`
4. **Output Directory**: `.next`

### Step 3: **Add Environment Variables**
In Vercel Dashboard → Settings → Environment Variables:

| Variable | Environment | Value |
|----------|-------------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | All | `https://your-id.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | All | `your_anon_key` |
| `NEXT_PUBLIC_HCAPTCHA_SITEKEY` | All | `your_site_key` |
| `HCAPTCHA_SECRET` | All | `your_secret_key` |
| `RESEND_API_KEY` | All | `re_your_api_key` |
| `NEXT_PUBLIC_APP_URL` | Preview | `https://your-git-branch-project.vercel.app` |
| `NEXT_PUBLIC_APP_URL` | Production | `https://sunshareenergy.ph` |

### Step 4: **Deploy**
1. Click "Deploy"
2. Wait for build to complete (~2-3 minutes)
3. Test deployment URL

---

## 🧪 Post-Deployment Testing

### **Functional Testing**
- [ ] Visit deployment URL
- [ ] Test full onboarding flow:
  - [ ] Step 1: Account creation with validation
  - [ ] Step 2: ID upload (test with sample image)
  - [ ] Step 3: Property details form
  - [ ] Step 4: Preferences selection
  - [ ] Step 5: Review and submit
- [ ] Test error handling
- [ ] Test mobile responsiveness

### **Integration Testing**
- [ ] Database connection working (check Supabase dashboard)
- [ ] Email sending functional (check email delivery)
- [ ] File uploads working (check Supabase storage)
- [ ] Analytics tracking active (check console logs)

### **Performance Testing**
- [ ] Page load speed < 3 seconds
- [ ] Form interactions smooth
- [ ] File upload performance acceptable
- [ ] Mobile performance good

---

## 🎯 User Testing Setup

### **Share Testing URL**
1. **Preview Environment**: `https://your-git-main-project.vercel.app/onboarding`
2. **Custom Domain** (optional): `https://test.sunshareenergy.ph/onboarding`

### **Testing Instructions for Users**
```
🧪 SUNSHARE ONBOARDING BETA TEST

Hi! You're invited to test our new customer registration system.

Test URL: [YOUR_VERCEL_URL]/onboarding

What to test:
✅ Complete the full 5-step registration process
✅ Try on both mobile and desktop
✅ Test with a real ID document photo
✅ Report any bugs or confusing parts

Time needed: ~5-10 minutes

Feedback form: [Include feedback collection method]
```

### **What to Monitor**
- [ ] User completion rates by step
- [ ] Drop-off points and reasons
- [ ] Error reports and technical issues
- [ ] User feedback and suggestions
- [ ] Mobile vs desktop performance

---

## 🛠 Troubleshooting Common Issues

### **Build Failures**
- **Missing environment variables**: Add dummy values for build
- **TypeScript errors**: Check imports and type definitions
- **API errors**: Ensure all API routes handle missing config gracefully

### **Runtime Issues**
- **Database connection failed**: Check Supabase URL and keys
- **Email sending failed**: Verify Resend API key and domain setup
- **File upload errors**: Check Supabase storage bucket permissions

### **Performance Issues**
- **Slow loading**: Check image optimization and bundle size
- **Slow file upload**: Verify file size limits and compression
- **High bounce rate**: Check mobile responsiveness and UX flow

---

## 📊 Analytics & Monitoring

### **Built-in Analytics**
- [ ] Form completion tracking active
- [ ] Error logging working
- [ ] User behavior tracking enabled
- [ ] Performance metrics collected

### **External Monitoring** (Optional)
- [ ] Google Analytics 4 setup
- [ ] Error monitoring (Sentry)
- [ ] Performance monitoring (Vercel Analytics)
- [ ] Uptime monitoring

---

## 🔄 Post-Launch Actions

### **Week 1**
- [ ] Monitor user registrations daily
- [ ] Collect and review feedback
- [ ] Fix critical bugs immediately
- [ ] Optimize based on user behavior

### **Week 2-4**
- [ ] Analyze conversion funnel data
- [ ] Implement user-requested improvements
- [ ] A/B test form variations
- [ ] Prepare admin dashboard for reviewing applications

### **Month 2**
- [ ] Full analytics review
- [ ] User interview sessions
- [ ] Major UX improvements
- [ ] Scale infrastructure if needed

---

## 🆘 Emergency Contacts

- **Technical Issues**: [Your contact]
- **Domain/DNS Issues**: [Domain manager]
- **Database Issues**: [Supabase support]
- **Email Issues**: [Resend support]

---

## 🎉 Success Criteria

**Launch is successful when:**
- [ ] 95%+ users complete Step 1 (account creation)
- [ ] 80%+ users complete full onboarding
- [ ] < 5% error rate across all steps
- [ ] Positive user feedback (>4/5 rating)
- [ ] Mobile completion rate matches desktop

**Ready for production when:**
- [ ] All tests passing
- [ ] Load testing completed
- [ ] Security review passed
- [ ] Admin workflow ready
- [ ] Customer support prepared