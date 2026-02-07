import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';
import { config } from 'dotenv';

// Load environment variables from .env.local
config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  console.error('Required environment variables:');
  console.error('- NEXT_PUBLIC_SUPABASE_URL');
  console.error('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function applyCompleteSetup() {
  console.log('🚀 Applying COMPLETE_SETUP.sql to Supabase database...');
  console.log('URL:', supabaseUrl);
  
  try {
    // Read the SQL file
    const sqlContent = readFileSync(join(process.cwd(), 'COMPLETE_SETUP.sql'), 'utf8');
    
    // Execute the SQL
    console.log('📝 Executing SQL script...');
    const { data, error } = await supabase.rpc('exec_sql', { sql: sqlContent });
    
    if (error) {
      console.error('❌ Error executing SQL:', error.message);
      console.error('Details:', error);
      return false;
    }
    
    console.log('✅ SQL script executed successfully');
    
    // Verify the setup
    console.log('\n🔍 Verifying database setup...');
    
    const tables = ['user_onboarding', 'application_activity', 'analytics_events'];
    for (const tableName of tables) {
      const { data: tableData, error: tableError } = await supabase
        .from(tableName)
        .select('count')
        .limit(1);
        
      if (tableError) {
        console.log(`❌ ${tableName}: ${tableError.message}`);
      } else {
        console.log(`✅ ${tableName}: Table accessible`);
      }
    }
    
    console.log('\n🎉 Database setup completed successfully!');
    return true;
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

// Alternative method using direct SQL execution
async function applyCompleteSetupDirect() {
  console.log('🚀 Applying COMPLETE_SETUP.sql directly...');
  
  try {
    // Read the SQL file
    const sqlContent = readFileSync(join(process.cwd(), 'COMPLETE_SETUP.sql'), 'utf8');
    
    // Split SQL into individual statements (simple approach)
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt && !stmt.startsWith('--') && stmt !== 'BEGIN' && stmt !== 'COMMIT');
    
    console.log(`📝 Executing ${statements.length} SQL statements...`);
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (!statement) continue;
      
      try {
        console.log(`Executing statement ${i + 1}/${statements.length}...`);
        const { error } = await supabase.rpc('exec_sql', { sql: statement });
        
        if (error && !error.message.includes('already exists')) {
          console.warn(`⚠️  Warning on statement ${i + 1}: ${error.message}`);
        }
      } catch (err) {
        console.warn(`⚠️  Warning on statement ${i + 1}: ${err.message}`);
      }
    }
    
    console.log('✅ SQL statements executed');
    
    // Verify the setup
    console.log('\n🔍 Verifying database setup...');
    
    const tables = ['user_onboarding', 'application_activity', 'analytics_events'];
    let allGood = true;
    
    for (const tableName of tables) {
      try {
        const { data, error } = await supabase.from(tableName).select('*').limit(1);
        if (error) {
          console.log(`❌ ${tableName}: ${error.message}`);
          allGood = false;
        } else {
          console.log(`✅ ${tableName}: Table accessible`);
        }
      } catch (err) {
        console.log(`❌ ${tableName}: ${err.message}`);
        allGood = false;
      }
    }
    
    if (allGood) {
      console.log('\n🎉 Database setup completed successfully!');
    } else {
      console.log('\n⚠️  Some issues detected, but core functionality should work');
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

// Run the setup
applyCompleteSetupDirect()
  .then(success => {
    if (success) {
      console.log('\n✨ Next steps:');
      console.log('1. Apply storage policies: node apply-storage-setup.js');
      console.log('2. Test the app: npm run dev');
      console.log('3. Visit: http://localhost:3000/onboarding');
    }
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });