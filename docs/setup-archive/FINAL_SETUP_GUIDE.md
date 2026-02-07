# 🎯 SunShare Database Setup - Final Instructions

## ✨ Quick 2-Step Setup (3 minutes)

### Step 1: Database Schema Setup
1. **Go to:** https://supabase.com/dashboard/project/eiewhroiqnppkexgppxf
2. **Navigate to:** SQL Editor (left sidebar)  
3. **Click:** "New Query"
4. **Copy & Paste:** The entire contents of `COMPLETE_SETUP.sql`
5. **Click:** "Run" ▶️

This single script will create:
- ✅ All 3 database tables  
- ✅ All security policies
- ✅ All triggers and functions
- ✅ All indexes for performance
- ✅ Verification queries

### Step 2: Storage Bucket Setup  
1. **Go to:** Storage (left sidebar)
2. **Click:** "New bucket" 
3. **Configure:**
   - Name: `id-documents`
   - **Private:** ✅ YES (critical!)
   - File size limit: `10MB`
   - Allowed MIME types: `image/jpeg,image/png,image/jpg,application/pdf`
4. **Click:** "Create bucket"
5. **Go back to:** SQL Editor → New Query
6. **Copy & Paste:** The entire contents of `STORAGE_SETUP.sql`  
7. **Click:** "Run" ▶️

## 🧪 Test Your Setup

1. **Start development server:**
   ```bash
   npm run dev
   ```

2. **Test the onboarding flow:**
   - Visit: http://localhost:3000/onboarding
   - Complete the 5-step registration process
   - Check your Supabase dashboard for new user data

## ✅ What You'll Have After Setup

### Database Tables:
- **`user_onboarding`** - Complete user application data
- **`application_activity`** - Audit trail of all changes  
- **`analytics_events`** - User behavior tracking

### Security Features:
- **Row Level Security (RLS)** - Users see only their data
- **Audit logging** - Automatic change tracking
- **Admin access controls** - Configurable via user metadata
- **Secure file storage** - User-scoped document access

### Application Features:
- **5-step onboarding wizard** with progress saving
- **ID document upload** with OCR text extraction  
- **Real-time form validation** 
- **Mobile-responsive design**
- **Authentication system** with session management
- **Analytics tracking** for optimization

## 🚨 If Something Goes Wrong

**Database setup fails:**
- Check the SQL Editor output for specific error messages
- Tables might already exist (this is OK, script handles it)
- Contact support if permissions errors occur

**Storage bucket creation fails:**
- Bucket name might already be taken (try `id-documents-sunshare`)
- Ensure you have admin access to the project
- Create bucket manually and run storage policies separately

**Application errors after setup:**
- Clear browser cache and cookies
- Check browser console for JavaScript errors
- Verify environment variables in `.env.local` are correct

## 📊 Database Schema Overview

```sql
user_onboarding
├── id (UUID, Primary Key)
├── user_id (References auth.users)
├── ID Document Info (type, file_name, extracted_data)
├── Property Details (type, ownership, address) 
├── Preferences (services, bill_range, referral_source)
├── Agreements (terms, privacy, newsletter)
└── Meta (status, timestamps)

application_activity  
├── id (UUID, Primary Key)
├── onboarding_id (References user_onboarding)
├── action_type (created, updated, status_changed, etc.)
└── audit trail data

analytics_events
├── id (UUID, Primary Key)  
├── user_id (References auth.users)
├── action (step_completed, form_submitted, etc.)
└── behavioral data
```

---

**🎉 Your SunShare onboarding system will be production-ready after this 3-minute setup!**