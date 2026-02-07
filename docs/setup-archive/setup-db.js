#!/usr/bin/env node

/**
 * Automated Supabase Database Setup Script
 * This script will set up the entire SunShare database schema
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Supabase configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://eiewhroiqnppkexgppxf.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpZXdocm9pcW5wcGtleGdwcHhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg4MzI4NDcsImV4cCI6MjA1NDQwODg0N30.TQUpvJ6r_k0gJUeU0eKDcLO9lCGEPF1LTf4oZJqCgtY';

async function setupDatabase() {
  console.log('🚀 Starting SunShare Database Setup...');
  
  // Initialize Supabase client
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  
  try {
    // Test connection
    console.log('📡 Testing database connection...');
    const { data, error } = await supabase.from('auth.users').select('count').limit(1);
    
    if (error) {
      console.error('❌ Connection failed:', error.message);
      return false;
    }
    
    console.log('✅ Database connection successful!');
    
    // Read and execute schema
    console.log('📄 Reading database schema...');
    const schemaPath = path.join(__dirname, 'COMPLETE_SETUP.sql');
    
    if (!fs.existsSync(schemaPath)) {
      console.error('❌ Schema file not found:', schemaPath);
      return false;
    }
    
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    console.log('✅ Schema file loaded');
    
    // Execute schema (this will likely fail with anon key, but let's try)
    console.log('⚡ Executing database schema...');
    const { data: schemaResult, error: schemaError } = await supabase.rpc('exec', { sql: schemaSql });
    
    if (schemaError) {
      console.error('❌ Schema execution failed:', schemaError.message);
      console.log('💡 This is expected with anon key. Manual setup required.');
      return false;
    }
    
    console.log('✅ Database schema created successfully!');
    
    // Try to create storage bucket
    console.log('🗂️ Creating storage bucket...');
    const { data: bucket, error: bucketError } = await supabase.storage.createBucket('id-documents', {
      public: false,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'],
      fileSizeLimit: 10485760 // 10MB
    });
    
    if (bucketError) {
      console.error('❌ Bucket creation failed:', bucketError.message);
      console.log('💡 This is expected with anon key. Manual setup required.');
      return false;
    }
    
    console.log('✅ Storage bucket created successfully!');
    
    return true;
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return false;
  }
}

// Main execution
setupDatabase().then(success => {
  if (success) {
    console.log('\n🎉 SunShare database setup complete!');
    console.log('🧪 Test your app at: http://localhost:3000/onboarding');
  } else {
    console.log('\n⚠️  Automated setup failed. Please use manual setup:');
    console.log('1. Go to: https://supabase.com/dashboard/project/eiewhroiqnppkexgppxf');
    console.log('2. SQL Editor > New Query > Paste COMPLETE_SETUP.sql > Run');
    console.log('3. Storage > New Bucket > "id-documents" (Private)');
    console.log('4. SQL Editor > New Query > Paste STORAGE_SETUP.sql > Run');
  }
}).catch(error => {
  console.error('💥 Script failed:', error);
  process.exit(1);
});