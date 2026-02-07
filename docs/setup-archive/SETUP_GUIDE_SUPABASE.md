# 🚀 SunShare Supabase Setup Guide

## Quick Setup (5 minutes)

### Step 1: Database Schema Setup
1. **Open your Supabase project:** https://supabase.com/dashboard/project/eiewhroiqnppkexgppxf
2. **Go to SQL Editor** (left sidebar)
3. **Run these migrations in order:**

   **Migration 1 - Tables & Indexes:**
   - Click "New Query"
   - Copy and paste the entire contents of `supabase/migrations/001_initial_schema.sql`
   - Click "Run" ▶️

   **Migration 2 - Security Policies:**
   - Click "New Query" 
   - Copy and paste the entire contents of `supabase/migrations/002_rls_policies.sql`
   - Click "Run" ▶️

   **Migration 3 - Triggers & Functions:**
   - Click "New Query"
   - Copy and paste the entire contents of `supabase/migrations/003_triggers_functions.sql`
   - Click "Run" ▶️

### Step 2: Storage Setup
1. **Go to Storage** (left sidebar)
2. **Create new bucket:**
   - Click "New bucket"
   - Name: `id-documents`
   - **Make it Private** (important for security)
   - File size limit: `10MB`
   - Allowed MIME types: `image/jpeg,image/png,image/jpg,application/pdf`
3. **Apply storage policies:**
   - Go back to **SQL Editor**
   - Click "New Query"
   - Copy and paste the entire contents of `supabase/storage-policies.sql`
   - Click "Run" ▶️

## ✅ Verification

After setup, you should see:
- **Tables:** `user_onboarding`, `application_activity`, `analytics_events`
- **Storage bucket:** `id-documents` (private)
- **Policies:** Row Level Security enabled on all tables

## 🧪 Testing

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Test the onboarding flow:**
   - Go to: http://localhost:3000/onboarding
   - Complete the 5-step registration process
   - Check your Supabase dashboard for new data

## 📊 Database Structure

### Tables Created:
- **`user_onboarding`** - Main application data
- **`application_activity`** - Audit trail and status changes  
- **`analytics_events`** - User behavior tracking

### Security Features:
- **Row Level Security (RLS)** - Users can only access their own data
- **Admin access** - Configurable via user metadata role field
- **Audit logging** - Automatic tracking of all changes
- **Data validation** - Check constraints on enums and required fields

## 🚨 Troubleshooting

**If SQL migrations fail:**
- Check for existing tables with same names
- Ensure you're running migrations in the correct order
- Look for error messages in the SQL Editor output

**If storage bucket creation fails:**
- Check if bucket already exists
- Verify you have admin access to the project
- Try creating manually through the Storage UI

**If authentication doesn't work:**
- Verify your environment variables in `.env.local`
- Check that the project URL matches your Supabase project
- Ensure the anon key is correct

## 🔧 Development Notes

- **Environment:** Already configured with real Supabase credentials
- **Authentication:** Ready for user registration and login
- **File uploads:** Configured for ID document storage
- **Analytics:** Optional event tracking enabled
- **Security:** Production-ready with RLS policies

Your SunShare onboarding system is now ready for development and testing! 🎉