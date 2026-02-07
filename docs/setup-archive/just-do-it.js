const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

async function justDoIt() {
  console.log('🚀 Executing complete database setup...');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  console.log('URL:', supabaseUrl);
  console.log('Service Role Key:', supabaseKey ? 'Found ✅' : 'Missing ❌');
  
  if (!supabaseKey) {
    console.log('❌ Service role key not found. Please check .env.local file.');
    return;
  }
  
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
  
  console.log('📖 Reading complete SQL setup...');
  const sqlPath = path.join(__dirname, 'COMPLETE_SETUP.sql');
  const sqlContent = fs.readFileSync(sqlPath, 'utf8');
  
  // Split SQL content into individual statements and execute them
  console.log('⚡ Executing database setup...');
  
  try {
    const { data, error } = await supabase.rpc('exec_sql', { 
      query: sqlContent 
    });
    
    if (error) {
      console.log('🔄 Trying alternative method...');
      // Try with a different RPC function name
      const { data: data2, error: error2 } = await supabase.rpc('sql', { 
        query: sqlContent 
      });
      
      if (error2) {
        console.log('❌ SQL execution failed:', error2.message);
        console.log('💡 Try executing manually in Supabase SQL Editor');
        return;
      } else {
        console.log('✅ Database setup completed via alternative method!');
        console.log('Result:', data2);
      }
    } else {
      console.log('✅ Database setup completed successfully!');
      console.log('Result:', data);
    }
  } catch (err) {
    console.log('❌ Error during setup:', err.message);
    console.log('💡 You may need to execute the SQL manually in Supabase Dashboard');
    console.log('📍 Go to: https://supabase.com/dashboard/project/eiewhroiqnppkexgppxf');
    console.log('📍 Navigate to SQL Editor > New Query');
    console.log('📍 Copy contents of COMPLETE_SETUP.sql and run it');
  }
  
  // Test connection by checking if tables exist
  console.log('\n🔍 Verifying setup...');
  try {
    const { data: tables, error } = await supabase
      .from('user_onboarding')
      .select('id')
      .limit(1);
      
    if (!error) {
      console.log('✅ Tables created and accessible!');
    } else {
      console.log('⚠️ Tables may not be accessible:', error.message);
    }
  } catch (err) {
    console.log('⚠️ Could not verify table access');
  }
  
  console.log('\n🎯 Next steps:');
  console.log('1. Create storage bucket "id-documents" in Supabase Dashboard');
  console.log('2. Run storage policies setup');
  console.log('3. Test onboarding flow at http://localhost:3000/onboarding');
}

justDoIt();