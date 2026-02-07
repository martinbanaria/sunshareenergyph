# 🚀 Complete SunShare Database Setup - Manual Instructions

## Current Status:
✅ Supabase connection verified  
✅ Storage bucket `id-documents` exists and configured  
✅ `user_onboarding` table exists  
❌ Missing: `application_activity` and `analytics_events` tables  
❌ Missing: Storage policies  

## Step 1: Apply Complete Database Schema 

**Go to:** https://supabase.com/dashboard/project/eiewhroiqnppkexgppxf/sql

**Copy and paste the ENTIRE contents** of `COMPLETE_SETUP.sql` into the SQL Editor and click **RUN**.

This will create:
- `application_activity` table (audit logging)
- `analytics_events` table (user behavior tracking) 
- Row Level Security policies
- Triggers and functions
- Database indexes

## Step 2: Apply Storage Policies

**In the same SQL Editor**, copy and paste the ENTIRE contents of `STORAGE_SETUP.sql` and click **RUN**.

This will secure your `id-documents` bucket so users can only access their own files.

## Step 3: Test Your Setup

Run the test script to verify everything works:

```bash
node test-db-connection.js
```

You should see:
```
✅ user_onboarding: Table exists
✅ application_activity: Table exists  
✅ analytics_events: Table exists
✅ Storage bucket exists: id-documents
```

## Step 4: Start Development Server

```bash
npm run dev
```

Then visit: http://localhost:3000/onboarding

## 🐛 Troubleshooting

**If tables still don't exist after Step 1:**
- Check the SQL Editor output for error messages
- Some statements might have failed - look for red error text
- Try running sections of COMPLETE_SETUP.sql individually

**If storage policies fail:**
- Make sure the `id-documents` bucket exists in Storage
- Bucket must be set to **Private** (not Public)
- Try running STORAGE_SETUP.sql again

**If the app throws errors:**
- Clear browser cache and cookies
- Check browser console (F12) for JavaScript errors
- Verify `.env.local` file has correct Supabase credentials

## 📋 Next Steps After Setup

1. **Test the complete onboarding flow** - Upload an ID document, fill out forms
2. **Check your database** - Verify data is being saved properly
3. **Test user authentication** - Try signing up and logging in
4. **Review audit logs** - Check the `application_activity` table for change tracking

---

**🎯 Goal:** After these steps, your SunShare onboarding system will be production-ready with full user data protection and audit logging!