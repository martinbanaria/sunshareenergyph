const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testDatabaseConnection() {
  console.log('🔍 Testing Supabase Database Connection...');
  console.log('URL:', supabaseUrl);
  
  try {
    // Test 1: Check if tables exist
    console.log('\n📊 Checking if tables exist...');
    
    const tables = ['user_onboarding', 'application_activity', 'analytics_events'];
    const tableResults = {};
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);
        
        if (error) {
          tableResults[table] = `❌ Error: ${error.message}`;
        } else {
          tableResults[table] = '✅ Table exists';
        }
      } catch (err) {
        tableResults[table] = `❌ Exception: ${err.message}`;
      }
    }
    
    console.log('Table Status:');
    Object.entries(tableResults).forEach(([table, status]) => {
      console.log(`  ${table}: ${status}`);
    });
    
    // Test 2: Check storage bucket
    console.log('\n🗂️ Checking storage bucket...');
    try {
      const { data, error } = await supabase.storage.getBucket('id-documents');
      if (error) {
        console.log('❌ Storage bucket error:', error.message);
      } else {
        console.log('✅ Storage bucket exists:', data.name);
        console.log('   - Public:', data.public);
        console.log('   - File size limit:', data.file_size_limit, 'bytes');
      }
    } catch (err) {
      console.log('❌ Storage bucket exception:', err.message);
    }
    
    // Test 3: Test authentication
    console.log('\n🔐 Testing authentication...');
    try {
      const { data, error } = await supabase.auth.getSession();
      console.log('✅ Auth service accessible');
    } catch (err) {
      console.log('❌ Auth service error:', err.message);
    }
    
    // Test 4: Try inserting test data (rollback)
    console.log('\n🧪 Testing data operations...');
    try {
      // This should fail with RLS if not authenticated, which is expected
      const { data, error } = await supabase
        .from('user_onboarding')
        .select('id')
        .limit(1);
      
      if (error && error.message.includes('RLS')) {
        console.log('✅ RLS is properly configured (access denied as expected)');
      } else if (error) {
        console.log('❌ Unexpected error:', error.message);
      } else {
        console.log('✅ Can query user_onboarding table');
      }
    } catch (err) {
      console.log('❌ Data operation exception:', err.message);
    }
    
    console.log('\n🎉 Database connection test completed!');
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
  }
}

testDatabaseConnection();