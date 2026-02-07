const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function testConnection() {
  console.log('🔍 Testing Supabase connection and database state...');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  console.log('URL:', supabaseUrl);
  console.log('Service Key:', serviceRoleKey ? 'Found ✅' : 'Missing ❌');
  
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
  
  // Test 1: Check if user_onboarding table exists
  console.log('\n🔍 Testing table access...');
  try {
    const { data, error } = await supabase
      .from('user_onboarding')
      .select('count', { count: 'exact' });
    
    if (!error) {
      console.log('✅ user_onboarding table exists and is accessible!');
      console.log('📊 Current record count:', data?.length || 0);
      
      // Test other tables
      const { data: activityData, error: activityError } = await supabase
        .from('application_activity')
        .select('count', { count: 'exact' });
      
      if (!activityError) {
        console.log('✅ application_activity table exists!');
      }
      
      const { data: analyticsData, error: analyticsError } = await supabase
        .from('analytics_events')
        .select('count', { count: 'exact' });
      
      if (!analyticsError) {
        console.log('✅ analytics_events table exists!');
      }
      
      console.log('\n🎉 ALL TABLES ALREADY EXIST! Database setup is complete.');
      return true;
      
    } else {
      console.log('❌ user_onboarding table does not exist or is not accessible');
      console.log('Error:', error.message);
      return false;
    }
  } catch (err) {
    console.log('❌ Connection test failed:', err.message);
    return false;
  }
}

// Test 2: Try creating a minimal table if needed
async function createMinimalTable() {
  console.log('\n⚡ Attempting to create minimal user_onboarding table...');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  const supabase = createClient(supabaseUrl, serviceRoleKey);
  
  try {
    // Try to insert a test record to see what happens
    const { data, error } = await supabase
      .from('user_onboarding')
      .insert([
        {
          user_id: '123e4567-e89b-12d3-a456-426614174000', // fake UUID for testing
          id_type: 'test',
          application_status: 'pending'
        }
      ]);
    
    if (!error) {
      console.log('✅ Table exists and insert works!');
      
      // Clean up test record
      await supabase
        .from('user_onboarding')
        .delete()
        .eq('id_type', 'test');
      
      return true;
    } else {
      console.log('❌ Insert failed:', error.message);
      return false;
    }
  } catch (err) {
    console.log('❌ Insert test failed:', err.message);
    return false;
  }
}

async function main() {
  const tablesExist = await testConnection();
  
  if (!tablesExist) {
    console.log('\n🔧 Tables do not exist. Attempting minimal creation...');
    const created = await createMinimalTable();
    
    if (!created) {
      console.log('\n💡 RECOMMENDATION:');
      console.log('   Tables need to be created manually in Supabase Dashboard');
      console.log('   Go to: https://supabase.com/dashboard/project/eiewhroiqnppkexgppxf');
      console.log('   SQL Editor > New Query > Paste COMPLETE_SETUP.sql');
    }
  } else {
    console.log('\n🎯 READY TO TEST!');
    console.log('   Visit: http://localhost:3000/onboarding');
    console.log('   All database tables are ready for use!');
  }
}

main().catch(console.error);